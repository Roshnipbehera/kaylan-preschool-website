import { NextRequest, NextResponse } from "next/server";
import { readInvoices, writeInvoices } from "../../_store";
import { updateInvoiceSchema } from "@/lib/validation/fees";
import { logAction } from "@/lib/audit/logAction";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = updateInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const invoices = await readInvoices();
    const idx = invoices.findIndex((i) => i.id === params.id);
    if (idx === -1) return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });

    const updated = { ...invoices[idx], ...parsed.data };
    invoices[idx] = updated;
    await writeInvoices(invoices);
    await logAction({ actor: "Kaylan Admin", action: `Updated invoice "${updated.title}" (status: ${updated.status})`, category: "fees" });
    return NextResponse.json({ success: true, data: updated });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const invoices = await readInvoices();
    const idx = invoices.findIndex((i) => i.id === params.id);
    if (idx === -1) return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
    const [removed] = invoices.splice(idx, 1);
    await writeInvoices(invoices);
    await logAction({ actor: "Kaylan Admin", action: `Deleted invoice "${removed.title}"`, category: "fees" });
    return NextResponse.json({ success: true, data: removed });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete invoice" }, { status: 500 });
  }
}
