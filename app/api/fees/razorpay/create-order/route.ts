import { NextRequest, NextResponse } from "next/server";
import { readInvoices } from "../../_store";
import { z } from "zod";

const createOrderSchema = z.object({
  invoiceId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Validation failed", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const invoices = await readInvoices();
  const invoice = invoices.find((i) => i.id === parsed.data.invoiceId);
  if (!invoice) {
    return NextResponse.json({ success: false, message: "Invoice not found" }, { status: 404 });
  }
  if (invoice.status === "paid") {
    return NextResponse.json({ success: false, message: "Invoice has already been paid" }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

  // If real/test keys are provided in environment, generate real order via Razorpay Orders API
  if (keyId && keySecret) {
    try {
      const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
      const amountInPaise = Math.round(invoice.amount * 100);

      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: "INR",
          receipt: invoice.id,
          notes: {
            studentId: invoice.studentId,
            invoiceTitle: invoice.title,
          },
        }),
      });

      const rzpData = (await rzpRes.json()) as { id?: string; error?: { description?: string } };

      if (!rzpRes.ok || !rzpData.id) {
        const errorMsg = rzpData.error?.description || "Razorpay order creation failed";
        return NextResponse.json({ success: false, message: errorMsg }, { status: 502 });
      }

      return NextResponse.json({
        success: true,
        data: {
          orderId: rzpData.id,
          amount: invoice.amount,
          currency: "INR",
          keyId,
          isSandbox: keyId.startsWith("rzp_test"),
        },
      });
    } catch (err) {
      return NextResponse.json(
        { success: false, message: err instanceof Error ? err.message : "Razorpay connection error" },
        { status: 502 },
      );
    }
  }

  // Development/Sandbox fallback when live credentials are not yet configured in env
  const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  return NextResponse.json({
    success: true,
    data: {
      orderId: mockOrderId,
      amount: invoice.amount,
      currency: "INR",
      keyId: "rzp_test_mock_mode",
      isSandbox: true,
    },
  });
}
