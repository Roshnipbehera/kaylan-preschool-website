import { prismaMock } from "../helpers/prismaMock";
import request from "supertest";
import { createApp } from "../../src/app";
import { signAccessToken } from "../../src/utils/token";

const app = createApp();

// PATCH /:id/status is mutating and NOT CSRF-exempt (only POST / is, see
// src/middleware/csrf.ts's CSRF_EXEMPT_PATHS).
const CSRF_TOKEN = "test-csrf-token-0123456789";
function cookies(accessToken?: string) {
  const list = [`kaylan_csrf_token=${CSRF_TOKEN}`];
  if (accessToken) list.push(`kaylan_access_token=${accessToken}`);
  return list;
}

const validPayload = {
  child: {
    fullName: "Jamie Kid",
    dateOfBirth: "2021-05-01",
    gender: "female",
    programApplyingFor: "Toddler",
    nationality: "Kenyan",
  },
  guardian: {
    fullName: "Jordan Guardian",
    relation: "Mother",
    phone: "+254700000000",
    email: "guardian@example.com",
    occupation: "Engineer",
    address: "123 Main St",
  },
  medical: {
    bloodGroup: "O+",
    emergencyContactName: "Alex Guardian",
    emergencyContactPhone: "+254700000001",
  },
  documents: {
    birthCertificateUrl: "https://res.cloudinary.com/x/birth.pdf",
    childPhotoUrl: "https://res.cloudinary.com/x/photo.jpg",
  },
};

function fakeAdmission(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "adm_1",
    parentUserId: null,
    child: validPayload.child,
    guardian: validPayload.guardian,
    medical: validPayload.medical,
    documents: validPayload.documents,
    status: "submitted",
    submittedAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("POST /api/v1/admissions (public, no auth)", () => {
  it("accepts a valid application without any auth token", async () => {
    prismaMock.admissionApplication.create.mockResolvedValue(fakeAdmission() as any);

    const res = await request(app).post("/api/v1/admissions").send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("submitted");
    expect(prismaMock.admissionApplication.create).toHaveBeenCalledTimes(1);
  });

  it("rejects a payload missing required child fields", async () => {
    const bad = { ...validPayload, child: { ...validPayload.child, fullName: "" } };
    const res = await request(app).post("/api/v1/admissions").send(bad);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(prismaMock.admissionApplication.create).not.toHaveBeenCalled();
  });

  it("rejects a payload with a malformed guardian email", async () => {
    const bad = { ...validPayload, guardian: { ...validPayload.guardian, email: "not-an-email" } };
    const res = await request(app).post("/api/v1/admissions").send(bad);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });
});

describe("GET /api/v1/admissions (admin-only list)", () => {
  it("returns 401 with no token", async () => {
    const res = await request(app).get("/api/v1/admissions");
    expect(res.status).toBe(401);
  });

  it("returns 403 for a non-admin (teacher) token", async () => {
    const token = signAccessToken({ id: "u1", role: "TEACHER", email: "t@t.com", name: "T" });
    const res = await request(app).get("/api/v1/admissions").set("Cookie", [`kaylan_access_token=${token}`]);
    expect(res.status).toBe(403);
  });

  it("returns 200 with the list for an admin token", async () => {
    const token = signAccessToken({ id: "u1", role: "ADMIN", email: "a@a.com", name: "A" });
    prismaMock.admissionApplication.findMany.mockResolvedValue([fakeAdmission()] as any);
    const res = await request(app).get("/api/v1/admissions").set("Cookie", [`kaylan_access_token=${token}`]);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

describe("PATCH /api/v1/admissions/:id/status", () => {
  it("returns 403 when a non-admin (parent) tries to update status", async () => {
    const token = signAccessToken({ id: "u1", role: "PARENT", email: "p@p.com", name: "P" });
    const res = await request(app)
      .patch("/api/v1/admissions/adm_1/status")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ status: "accepted" });
    expect(res.status).toBe(403);
    expect(prismaMock.admissionApplication.update).not.toHaveBeenCalled();
  });

  it("allows an admin to update status and calls Prisma with correct args", async () => {
    const token = signAccessToken({ id: "admin_1", role: "ADMIN", email: "a@a.com", name: "A" });
    prismaMock.admissionApplication.update.mockResolvedValue(fakeAdmission({ status: "accepted" }) as any);

    const res = await request(app)
      .patch("/api/v1/admissions/adm_1/status")
      .set("Cookie", cookies(token))
      .set("x-csrf-token", CSRF_TOKEN)
      .send({ status: "accepted" });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("accepted");
    expect(prismaMock.admissionApplication.update).toHaveBeenCalledWith({
      where: { id: "adm_1" },
      data: { status: "accepted" },
    });
  });
});
