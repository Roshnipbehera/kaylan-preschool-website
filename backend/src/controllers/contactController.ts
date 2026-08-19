import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/errorHandler";

// Public marketing-site "Find Us" enquiry form (components/Contact.tsx).
// Deliberately minimal -- same field set the existing (previously
// unwired) form collects: parent name, phone, a short message. Mirrors
// admissionController.ts's/eventController.ts's create-endpoint shape
// (schema.parse, prisma.create, 201 + { success, data }) for consistency.

const createContactInquirySchema = z.object({
  parentName: z.string().min(2, "Please enter your name"),
  phone: z.string().min(7, "A valid phone number is required"),
  message: z.string().min(5, "Please tell us a little about your enquiry"),
});

function toContactInquiryDto(row: {
  id: string;
  parentName: string;
  phone: string;
  message: string;
  submittedAt: Date;
}) {
  return {
    id: row.id,
    parentName: row.parentName,
    phone: row.phone,
    message: row.message,
    submittedAt: row.submittedAt.toISOString(),
  };
}

export async function createContactInquiry(req: Request, res: Response) {
  const data = createContactInquirySchema.parse(req.body);
  const inquiry = await prisma.contactInquiry.create({ data });
  res.status(201).json({ success: true, data: toContactInquiryDto(inquiry) });
}

export async function listContactInquiries(req: Request, res: Response) {
  const { page, pageSize } = req.query as { page?: string; pageSize?: string };
  const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : undefined;
  const pageSizeNum = pageSize ? Math.min(100, Math.max(1, parseInt(pageSize, 10) || 50)) : undefined;

  const [inquiries, total] = await Promise.all([
    prisma.contactInquiry.findMany({
      orderBy: { submittedAt: "desc" },
      ...(pageNum && pageSizeNum ? { skip: (pageNum - 1) * pageSizeNum, take: pageSizeNum } : {}),
    }),
    pageNum && pageSizeNum ? prisma.contactInquiry.count() : Promise.resolve(undefined),
  ]);

  res.json({
    success: true,
    data: inquiries.map(toContactInquiryDto),
    ...(total !== undefined ? { meta: { page: pageNum, pageSize: pageSizeNum, total } } : {}),
  });
}

export async function getContactInquiryById(req: Request, res: Response) {
  const inquiry = await prisma.contactInquiry.findUnique({ where: { id: req.params.id } });
  if (!inquiry) throw new AppError("Inquiry not found", 404);
  res.json({ success: true, data: toContactInquiryDto(inquiry) });
}
