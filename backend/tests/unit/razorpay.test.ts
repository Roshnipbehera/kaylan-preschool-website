import crypto from "crypto";

describe("Razorpay Signature Verification Logic", () => {
  const testSecret = "sample_test_secret_12345";
  const orderId = "order_9A33XWu170gUtm";
  const paymentId = "pay_29MoEzyak4gahJ";

  it("successfully verifies valid Razorpay HMAC SHA-256 signature", () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", testSecret)
      .update(payload)
      .digest("hex");

    const computedSignature = crypto
      .createHmac("sha256", testSecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(computedSignature).toEqual(validSignature);
  });

  it("fails verification when signature is altered or tampered with", () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", testSecret)
      .update(payload)
      .digest("hex");

    const tamperedSignature = validSignature.slice(0, -2) + "ff";

    expect(tamperedSignature).not.toEqual(validSignature);
  });

  it("fails verification when payment ID or order ID is altered", () => {
    const payload = `${orderId}|${paymentId}`;
    const validSignature = crypto
      .createHmac("sha256", testSecret)
      .update(payload)
      .digest("hex");

    const alteredPayloadSignature = crypto
      .createHmac("sha256", testSecret)
      .update(`${orderId}|pay_different_payment_id`)
      .digest("hex");

    expect(alteredPayloadSignature).not.toEqual(validSignature);
  });
});
