import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";
import { logAudit } from "../lib/audit";

// Live CMS Sections CRUD (Batch 2 migration cleanup pass). Replaces
// app/api/cms/[section] (JSON-backed, data/cms/*.json). Response shape
// mirrors lib/types/cms.ts's CmsSectionMap[section] exactly -- contentJson
// is a flexible Prisma Json column so each section's own shape is opaque
// to the backend. Reads are public (marketing pages are public); writes
// require an authenticated admin.

const updateCmsSchema = z.object({
  content: z.unknown(),
});

type CmsSectionRow = {
  id: string;
  sectionKey: string;
  contentJson: unknown;
  updatedAt: Date;
  updatedByUserId: string | null;
};

function toCmsDto(row: CmsSectionRow) {
  return row.contentJson;
}

export async function listCmsSections(_req: Request, res: Response) {
  const rows = await prisma.cmsSection.findMany({ orderBy: { sectionKey: "asc" } });
  res.json({
    success: true,
    data: rows.map((r) => ({
      sectionKey: r.sectionKey,
      content: r.contentJson,
      updatedAt: r.updatedAt.toISOString(),
      updatedByUserId: r.updatedByUserId ?? undefined,
    })),
  });
}

export async function getCmsSection(req: Request, res: Response) {
  const { sectionKey } = req.params;
  const row = await prisma.cmsSection.findUnique({ where: { sectionKey } });
  if (!row) throw new AppError("CMS section not found", 404);
  // Public, unauthenticated marketing content -- safe to let CDNs/browsers cache briefly.
  res.set("Cache-Control", "public, max-age=60");
  res.json({ success: true, data: toCmsDto(row as CmsSectionRow) });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function _placeholder() {}

export async function updateCmsSection(req: Request, res: Response) {
  const { sectionKey } = req.params;
  // The frontend's updateCmsSection(section, data) PUTs the raw section
  // content object directly as the body (not wrapped in { content }), to
  // match the existing lib/api/cms.ts contract -- accept either shape.
  const parsed = updateCmsSchema.safeParse(req.body);
  const content = parsed.success && parsed.data.content !== undefined ? parsed.data.content : req.body;

  const row = await prisma.cmsSection.upsert({
    where: { sectionKey },
    create: {
      sectionKey,
      contentJson: content as object,
      updatedByUserId: req.user?.sub,
    },
    update: {
      contentJson: content as object,
      updatedByUserId: req.user?.sub,
    },
  });
  res.json({ success: true, data: toCmsDto(row as CmsSectionRow) });
}
