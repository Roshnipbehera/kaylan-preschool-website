// Email template functions for the Admissions flow, structured consistently
// with backend/src/config/nodemailer.ts's template style
// (verificationEmailTemplate / passwordResetEmailTemplate). Not called live
// -- the frontend mock simulates sending via console.log + toast (see
// components/admissions/AdmissionApplyForm.tsx and
// app/(dashboard)/admin/admissions/AdminAdmissionsContent.tsx).

export function admissionReceivedEmailTemplate(childName: string, applicationId: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Application Received!</h2>
      <p>Thank you for applying to Kaylan Preschool on behalf of <strong>${childName}</strong>.</p>
      <p>Your application reference number is <strong>${applicationId}</strong>. Our admissions team will review it shortly.</p>
      <p>You can track the status of this application anytime from your parent dashboard.</p>
    </div>
  `;
}

export function admissionStatusUpdatedEmailTemplate(
  childName: string,
  applicationId: string,
  status: string,
): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Admission Status Update</h2>
      <p>The status of the admission application for <strong>${childName}</strong> (ref: ${applicationId}) has been updated to:</p>
      <p style="font-size: 18px; font-weight: bold; color: #FF8FB1;">${status.replace("-", " ").toUpperCase()}</p>
      <p>Log in to your parent dashboard for full details.</p>
    </div>
  `;
}
