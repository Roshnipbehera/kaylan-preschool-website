import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { logAudit } from "../lib/audit";

// Live Admissions CRUD (Batch 2 migration pass). Replaces the legacy
// Mongoose-backed scaffold (../models/Admission, never actually wired to a
// live DB in this sandbox) AND app/api/admissions/** (JSON-backed,
// data/admissions/*.json). Response shape mirrors
// lib/types/admissions.ts's AdmissionApplication exactly -- the only
// wrinkle is `status`: the frontend/Zod contract uses the hyphenated value
// "under-review", but Prisma enum members can't contain hyphens, so the DB
// enum uses "under_review" and toAdmissionDto()/fromDtoStatus() translate
// at the boundary. POST is intentionally NOT behind requireAuth: the
// public multi-step application form (app/admissions/apply) may be
// submitted by a visitor who is not logged in yet.

const childSchema = z.object({
  fullName: z.string().min(2),
  dateOfBirth: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  programApplyingFor: z.string().min(1),
  nationality: z.string().min(2),
});

const guardianSchema = z.object({
  fullName: z.string().min(2),
  relation: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email(),
  occupation: z.string().min(2),
  address: z.string().min(5),
});

const medicalSchema = z.object({
  allergies: z.string().optional().default(""),
  conditions: z.string().optional().default(""),
  bloodGroup: z.string().min(1),
  emergencyContactName: z.string().min(2),
  emergencyContactPhone: z.string().min(7),
  doctorName: z.string().optional().default(""),
  doctorPhone: z.string().optional().default(""),
});

const documentsSchema = z.object({
  birthCertificateUrl: z.string().min(1),
  childPhotoUrl: z.string().min(1),
});

const createAdmissionSchema = z.object({
  parentUserId: z.string().optional(),
  child: childSchema,
  guardian: guardianSchema,
  medical: medicalSchema,
  documents: documentsSchema,
});

const dtoStatusValues = ["submitted", "under-review", "accepted", "rejected", "waitlisted"] as const;
const updateStatusSchema = z.object({ status: z.enum(dtoStatusValues) });

type DbStatus = "submitted" | "under_review" | "accepted" | "rejected" | "waitlisted";

function toDbStatus(status: (typeof dtoStatusValues)[number]): DbStatus {
  return status === "under-review" ? "under_review" : status;
}
function toDtoStatus(status: DbStatus): (typeof dtoStatusValues)[number] {
  return status === "under_review" ? "under-review" : status;
}

type AdmissionRow = {
  id: string;
  parentUserId: string | null;
  child: unknown;
  guardian: unknown;
  medical: unknown;
  documents: unknown;
  status: DbStatus;
  submittedAt: Date;
  updatedAt: Date;
};

function toAdmissionDto(row: AdmissionRow) {
  return {
    id: row.id,
    parentUserId: row.parentUserId ?? undefined,
    child: row.child,
    guardian: row.guardian,
    medical: row.medical,
    documents: row.documents,
    status: toDtoStatus(row.status),
    submittedAt: row.submittedAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createAdmission(req: Request, res: Response) {
  const data = createAdmissionSchema.parse(req.body);
  const admission = await prisma.admissionApplication.create({
    data: {
      parentUserId: data.parentUserId || null,
      child: data.child,
      guardian: data.guardian,
      medical: data.medical,
      documents: data.documents,
      status: "submitted",
    },
  });
  res.status(201).json({ success: true, data: toAdmissionDto(admission as AdmissionRow) });
}

export async function listAdmissions(req: Request, res: Response) {
  const { parentUserId, status, page, pageSize } = req.query as {
    parentUserId?: string;
    status?: string;
    page?: string;
    pageSize?: string;
  };
  const where: Record<string, unknown> = {};
  if (parentUserId) where.parentUserId = parentUserId;
  if (status) where.status = toDbStatus(status as (typeof dtoStatusValues)[number]);

  // Optional page/pageSize (admin admissions list can grow unbounded over
  // time). Omitting them preserves the original unbounded-list behavior
  // for any existing caller that doesn't pass them, so this is additive.
  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : undefined;
  const pageSizeNum = pageSize ? Math.min(100, Math.max(1, parseInt(pageSize, 10) || 50)) : undefined;

  const [admissions, total] = await Promise.all([
    prisma.admissionApplication.findMany({
      where,
      orderBy: { submittedAt: "desc" },
      ...(pageNum && pageSizeNum ? { skip: (pageNum - 1) * pageSizeNum, take: pageSizeNum } : {}),
    }),
    pageNum && pageSizeNum ? prisma.admissionApplication.count({ where }) : Promise.resolve(undefined),
  ]);

  res.json({
    success: true,
    data: admissions.map((a) => toAdmissionDto(a as AdmissionRow)),
    ...(total !== undefined ? { meta: { page: pageNum, pageSize: pageSizeNum, total } } : {}),
  });
}

export async function getAdmissionById(req: Request, res: Response) {
  const admission = await prisma.admissionApplication.findUnique({ where: { id: req.params.id } });
  if (!admission) throw new AppError("Application not found", 404);
  if (req.user?.role === "parent" && admission.parentUserId !== req.user.sub) {
    throw new AppError("Forbidden", 403);
  }
  res.json({ success: true, data: toAdmissionDto(admission as AdmissionRow) });
}

export async function updateAdmissionStatus(req: Request, res: Response) {
  const { status } = updateStatusSchema.parse(req.body);
  try {
    const admission = await prisma.admissionApplication.update({
      where: { id: req.params.id },
      data: { status: toDbStatus(status) },
    });
    await logAudit(req, {
      action: `Application #${admission.id} status changed to ${status}`,
      category: "admissions",
      entity: "AdmissionApplication",
      entityId: admission.id,
    });
    res.json({ success: true, data: toAdmissionDto(admission as AdmissionRow) });
  } catch {
    throw new AppError("Application not found", 404);
  }
}
