// Seeds the SAME demo accounts the previous JSON-mock auth system used
// (see lib/api/auth.ts's MOCK_USERS + data/users/users.json on the
// frontend), so existing documented login credentials keep working after
// the migration to Postgres. Also seeds two Student records so the
// Messaging demo has real conversation partners, plus a starter
// conversation + message between the parent and teacher accounts.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Seeds one CmsSection row per data/cms/*.json file with that file's REAL
// current content as contentJson -- these are the frontend's actual
// current marketing-page seed values (see lib/hooks/useCmsSection.ts,
// which uses each component's local seed as `initialData` so there is
// zero visual change once the CMS becomes the live source of truth).
// Reading the JSON files directly (rather than hand-transcribing them)
// guarantees byte-for-byte content parity with the pre-migration site.
async function seedCmsSections() {
  const cmsDir = path.join(__dirname, "..", "data", "cms");
  const files = fs.readdirSync(cmsDir).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const sectionKey = file.replace(/\.json$/, "");
    const contentJson = JSON.parse(fs.readFileSync(path.join(cmsDir, file), "utf8"));
    await prisma.cmsSection.upsert({
      where: { sectionKey },
      create: { sectionKey, contentJson },
      update: { contentJson },
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${files.length} CMS sections:`, files.map((f) => f.replace(/\.json$/, "")).join(", "));
}

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // IDs are pinned to the SAME "u_parent_1" / "u_teacher_1" / "u_admin_1"
  // convention the old JSON mock (data/users/users.json) used, and which
  // the still-JSON-backed domains (data/students/students.json,
  // data/progress/reports.json, data/users/preferences.json) already
  // reference via parentUserId/teacherUserId/userId fields. Prisma allows
  // supplying an explicit id even though the column default is cuid(), so
  // pinning these keeps every JSON domain's foreign-key-by-string coherent
  // with the real Postgres user without having to rewrite those JSON files
  // to point at randomly generated cuids.
  const parent = await prisma.user.upsert({
    where: { email: "parent@kaylan.school" },
    update: {},
    create: {
      id: "u_parent_1",
      name: "Ananya Rao",
      email: "parent@kaylan.school",
      passwordHash: password,
      role: "PARENT",
      isEmailVerified: true,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: "teacher@kaylan.school" },
    update: {},
    create: {
      id: "u_teacher_1",
      name: "Meera Iyer",
      email: "teacher@kaylan.school",
      passwordHash: password,
      role: "TEACHER",
      isEmailVerified: true,
      className: "Sunshine Room",
      subject: "Early Literacy",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@kaylan.school" },
    update: {},
    create: {
      id: "u_admin_1",
      name: "Kaylan Admin",
      email: "admin@kaylan.school",
      passwordHash: password,
      role: "ADMIN",
      isEmailVerified: true,
    },
  });

  // Full Student records (Batch 1 pass). Same demo children/details that
  // data/students/students.json previously held (student_1/student_2),
  // now real Postgres rows FK'd to the real seeded parent/teacher User
  // ids so admin/teacher/parent dashboards keep working end-to-end.
  const student1 = await prisma.student.upsert({
    where: { id: "seed_student_1" },
    update: {},
    create: {
      id: "seed_student_1",
      parentId: parent.id,
      teacherId: teacher.id,
      fullName: "Aarav Rao",
      dateOfBirth: new Date("2021-03-14"),
      program: "Nursery",
      className: "Sunshine Room",
      bloodGroup: "O+",
      allergies: "Peanuts",
      photo: "",
      guardianName: "Ananya Rao",
      guardianPhone: "+91 98765 43210",
      guardianEmail: "parent@kaylan.school",
      emergencyContactName: "Rohan Rao",
      emergencyContactRelationship: "Father",
      emergencyContactPhone: "+91 98765 43211",
    },
  });
  const student2 = await prisma.student.upsert({
    where: { id: "seed_student_2" },
    update: {},
    create: {
      id: "seed_student_2",
      parentId: parent.id,
      teacherId: teacher.id,
      fullName: "Diya Rao",
      dateOfBirth: new Date("2022-08-02"),
      program: "Toddler",
      className: "Rainbow Room",
      bloodGroup: "O+",
      allergies: "None",
      photo: "",
      guardianName: "Ananya Rao",
      guardianPhone: "+91 98765 43210",
      guardianEmail: "parent@kaylan.school",
      emergencyContactName: "Rohan Rao",
      emergencyContactRelationship: "Father",
      emergencyContactPhone: "+91 98765 43211",
    },
  });

  // A realistic month of Attendance for student1 (mirrors the shape/volume
  // of the old data/attendance/records.json demo data).
  const attendanceDay = (offsetDays: number, status: "present" | "absent" | "late", notes = "") => {
    const date = new Date("2026-07-01T00:00:00.000Z");
    date.setUTCDate(date.getUTCDate() + offsetDays);
    return { date, status, notes };
  };
  const attendanceSeed = [
    attendanceDay(0, "present"),
    attendanceDay(1, "present"),
    attendanceDay(2, "present"),
    attendanceDay(5, "present"),
    attendanceDay(6, "present"),
    attendanceDay(7, "present"),
    attendanceDay(8, "absent", "Fever, resting at home"),
    attendanceDay(9, "present"),
    attendanceDay(12, "late", "Traffic delay"),
    attendanceDay(13, "present"),
  ];
  for (const entry of attendanceSeed) {
    await prisma.attendance.upsert({
      where: { studentId_date: { studentId: student1.id, date: entry.date } },
      update: {},
      create: {
        studentId: student1.id,
        date: entry.date,
        status: entry.status as never,
        markedBy: teacher.name,
        notes: entry.notes,
      },
    });
  }

  // A few realistic Homework assignments (mirrors data/homework/assignments.json).
  const homeworkSeed = [
    {
      id: "seed_hw_1",
      className: "Sunshine Room",
      subject: "Numbers",
      title: "Count and Colour 1-10",
      description: "Colour in the number worksheet and practice counting objects from 1 to 10 with a family member.",
      assignedDate: new Date("2026-07-22"),
      dueDate: new Date("2026-07-25"),
      status: "submitted" as const,
    },
    {
      id: "seed_hw_2",
      className: "Sunshine Room",
      subject: "Language",
      title: "My Family Picture Story",
      description: "Draw a picture of your family and be ready to talk about each person in class.",
      assignedDate: new Date("2026-07-27"),
      dueDate: new Date("2026-08-02"),
      status: "pending" as const,
    },
    {
      id: "seed_hw_3",
      className: "Sunshine Room",
      subject: "Science",
      title: "Plant a Seed",
      description: "Plant a bean seed in a small cup with soil and water it daily. Bring it to class in two weeks for our growth journal.",
      assignedDate: new Date("2026-07-15"),
      dueDate: new Date("2026-07-29"),
      status: "overdue" as const,
    },
    {
      id: "seed_hw_4",
      className: "Rainbow Room",
      subject: "Motor Skills",
      title: "Practice Buttoning",
      description: "Practice buttoning and unbuttoning a shirt at home for 5 minutes each day.",
      assignedDate: new Date("2026-07-24"),
      dueDate: new Date("2026-08-05"),
      status: "pending" as const,
    },
  ];
  for (const hw of homeworkSeed) {
    await prisma.homework.upsert({
      where: { id: hw.id },
      update: {},
      create: { ...hw, teacherId: teacher.id },
    });
  }

  void student2;

  const existingConvo = await prisma.conversation.findFirst({
    where: { AND: [{ participants: { some: { userId: parent.id } } }, { participants: { some: { userId: teacher.id } } }] },
  });

  if (!existingConvo) {
    const conversation = await prisma.conversation.create({
      data: {
        subject: "Aarav's progress",
        participants: {
          create: [
            { userId: parent.id, roleAtJoin: "PARENT" },
            { userId: teacher.id, roleAtJoin: "TEACHER" },
          ],
        },
      },
    });

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        senderId: teacher.id,
        body: "Hi Ananya, Aarav had a wonderful day at circle time today!",
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log("Seeded users:", { parent: parent.email, teacher: teacher.email, admin: admin.email });

  await seedCmsSections();
  await seedBlog();
  await seedGallery();
  await seedEvents();
  await seedFees(student1.id, student2.id);
  await seedSettings();
  await seedAuditLogs();
}

// Batch 4 pass: migrates the REAL existing sample data from
// data/fees/{invoices,payments}.json into FeeInvoice/FeePayment. The JSON's
// studentId values ("student_1"/"student_2") are remapped to the real
// seeded Student cuids (seed_student_1/seed_student_2) so the demo parent
// account sees these invoices/payments end-to-end.
async function seedFees(student1Id: string, student2Id: string) {
  const dataDir = path.join(__dirname, "..", "data", "fees");
  const invoices = JSON.parse(fs.readFileSync(path.join(dataDir, "invoices.json"), "utf8")) as Array<{
    id: string;
    studentId: string;
    title: string;
    status: string;
    amount: number;
    dueDate: string;
    issuedDate: string;
    lineItems: Array<{ label: string; amount: number }>;
  }>;
  const payments = JSON.parse(fs.readFileSync(path.join(dataDir, "payments.json"), "utf8")) as Array<{
    id: string;
    invoiceId: string;
    studentId: string;
    amount: number;
    method: string;
    status: string;
    paidAt: string;
  }>;

  const studentIdMap: Record<string, string> = { student_1: student1Id, student_2: student2Id };

  const invoiceIdMap = new Map<string, string>();
  for (const inv of invoices) {
    const studentId = studentIdMap[inv.studentId] ?? student1Id;
    const row = await prisma.feeInvoice.upsert({
      where: { id: `seed_${inv.id}` },
      update: {},
      create: {
        id: `seed_${inv.id}`,
        studentId,
        title: inv.title,
        status: inv.status,
        amount: inv.amount,
        dueDate: new Date(inv.dueDate),
        issuedDate: new Date(inv.issuedDate),
        lineItems: inv.lineItems as never,
      },
    });
    invoiceIdMap.set(inv.id, row.id);
  }

  for (const pay of payments) {
    const invoiceId = invoiceIdMap.get(pay.invoiceId);
    if (!invoiceId) continue; // e.g. pay_2/pay_3 reference invoices not in the current invoices.json sample -- skip, not fabricating data
    const studentId = studentIdMap[pay.studentId] ?? student1Id;
    await prisma.feePayment.upsert({
      where: { id: `seed_${pay.id}` },
      update: {},
      create: {
        id: `seed_${pay.id}`,
        invoiceId,
        studentId,
        amount: pay.amount,
        method: pay.method,
        status: pay.status,
        paidAt: new Date(pay.paidAt),
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${invoices.length} fee invoices and ${invoiceIdMap.size ? payments.filter((p) => invoiceIdMap.has(p.invoiceId)).length : 0} fee payments`);
}

// Batch 4 pass: migrates data/settings/system.json's real current values
// into the single SystemSetting row keyed "system".
async function seedSettings() {
  const filePath = path.join(__dirname, "..", "data", "settings", "system.json");
  const settings = JSON.parse(fs.readFileSync(filePath, "utf8"));
  await prisma.systemSetting.upsert({
    where: { key: "system" },
    update: {},
    create: { key: "system", value: settings },
  });
  // eslint-disable-next-line no-console
  console.log("Seeded system settings");
}

// Batch 4 pass: migrates the REAL existing sample entries from
// data/audit/logs.json into AuditLog. actorName is kept as the JSON's
// plain display-name string (matching the live AuditLog.actorName column);
// userId is left null for these historical seed rows since the JSON
// doesn't record a user id, only a display name -- best-effort match by
// name for the two accounts we do control (admin/teacher).
async function seedAuditLogs() {
  const filePath = path.join(__dirname, "..", "data", "audit", "logs.json");
  const logs = JSON.parse(fs.readFileSync(filePath, "utf8")) as Array<{
    id: string;
    actor: string;
    action: string;
    category: string;
    createdAt: string;
  }>;

  for (const log of logs) {
    await prisma.auditLog.upsert({
      where: { id: `seed_${log.id}` },
      update: {},
      create: {
        id: `seed_${log.id}`,
        actorName: log.actor,
        action: log.action,
        category: log.category,
        createdAt: new Date(log.createdAt),
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${logs.length} audit log entries`);
}

// Batch 3 pass: migrates the ACTUAL existing sample content from
// data/blog/{authors,posts}.json / data/gallery/albums.json /
// data/events/events.json (read directly, not hand-transcribed, for
// byte-for-byte parity) into the new Prisma-backed Blog/Gallery/Events
// domains.
async function seedBlog() {
  const dataDir = path.join(__dirname, "..", "data", "blog");
  const authors = JSON.parse(fs.readFileSync(path.join(dataDir, "authors.json"), "utf8")) as Array<{
    id: string;
    slug: string;
    name: string;
    bio: string;
    avatarUrl?: string;
  }>;
  const posts = JSON.parse(fs.readFileSync(path.join(dataDir, "posts.json"), "utf8")) as Array<{
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    body: string;
    coverImageUrl?: string;
    category: string;
    tags: string[];
    authorId: string;
    published: boolean;
    publishedAt?: string;
  }>;

  const authorIdMap = new Map<string, string>();
  for (const a of authors) {
    const row = await prisma.blogAuthor.upsert({
      where: { slug: a.slug },
      update: { name: a.name, bio: a.bio, avatarUrl: a.avatarUrl },
      create: { slug: a.slug, name: a.name, bio: a.bio, avatarUrl: a.avatarUrl },
    });
    authorIdMap.set(a.id, row.id);
  }

  for (const p of posts) {
    const authorId = authorIdMap.get(p.authorId);
    if (!authorId) continue;
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        body: p.body,
        coverImageUrl: p.coverImageUrl,
        category: p.category,
        tags: p.tags,
        authorId,
        published: p.published,
        publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
      },
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${authors.length} blog authors and ${posts.length} blog posts`);
}

async function seedGallery() {
  const dataDir = path.join(__dirname, "..", "data", "gallery");
  const albums = JSON.parse(fs.readFileSync(path.join(dataDir, "albums.json"), "utf8")) as Array<{
    title: string;
    slug: string;
    coverImage: string;
    description?: string;
    items: Array<{ type: "image" | "video"; url: string; thumbnailUrl?: string; caption?: string }>;
  }>;

  for (const album of albums) {
    const row = await prisma.galleryAlbum.upsert({
      where: { slug: album.slug },
      update: { title: album.title, coverImage: album.coverImage, description: album.description },
      create: {
        title: album.title,
        slug: album.slug,
        coverImage: album.coverImage,
        description: album.description,
      },
    });
    // Re-seed items idempotently: clear + recreate so re-running the seed
    // doesn't duplicate items on every run.
    await prisma.galleryItem.deleteMany({ where: { albumId: row.id } });
    await prisma.galleryItem.createMany({
      data: album.items.map((item, idx) => ({
        albumId: row.id,
        type: item.type,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        caption: item.caption,
        order: idx,
      })),
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${albums.length} gallery albums`);
}

async function seedEvents() {
  const dataDir = path.join(__dirname, "..", "data", "events");
  const events = JSON.parse(fs.readFileSync(path.join(dataDir, "events.json"), "utf8")) as Array<{
    title: string;
    description: string;
    date: string;
    location: string;
    coverImage?: string;
  }>;

  // Original seed dates were pinned relative to a past "today"; if they've
  // since fallen into the past, shift the whole batch forward so the
  // calendar/countdown-to-next-event demo still shows meaningful upcoming
  // events, preserving spacing between events.
  const parsedDates = events.map((e) => new Date(e.date).getTime());
  const earliest = Math.min(...parsedDates);
  const now = Date.now();
  const shiftMs = earliest < now ? now - earliest + 3 * 24 * 60 * 60 * 1000 : 0;

  for (const e of events) {
    const date = new Date(new Date(e.date).getTime() + shiftMs);
    const existing = await prisma.event.findFirst({ where: { title: e.title } });
    if (existing) {
      await prisma.event.update({ where: { id: existing.id }, data: { date } });
    } else {
      await prisma.event.create({
        data: {
          title: e.title,
          description: e.description,
          date,
          location: e.location,
          coverImage: e.coverImage,
        },
      });
    }
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${events.length} events${shiftMs ? " (dates shifted forward to stay upcoming)" : ""}`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
