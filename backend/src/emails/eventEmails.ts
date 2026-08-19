// Email template functions for the Events flow, structured consistently with
// backend/src/emails/admissionEmails.ts and
// backend/src/config/nodemailer.ts's template style. Not called live -- the
// frontend mock simulates sending via console.log (see
// app/api/events/[id]/rsvp/route.ts) + toast (see components/events/RsvpForm.tsx).

export function rsvpConfirmationEmailTemplate(
  guestName: string,
  eventTitle: string,
  eventDate: string,
  guests: number,
): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>You're Confirmed! 🎉</h2>
      <p>Hi <strong>${guestName}</strong>, thanks for RSVPing to <strong>${eventTitle}</strong>.</p>
      <p>Date: <strong>${new Date(eventDate).toLocaleString()}</strong></p>
      <p>Guests: <strong>${guests}</strong></p>
      <p>We can't wait to see you there! You'll receive a reminder as the date approaches.</p>
    </div>
  `;
}

export function eventReminderEmailTemplate(guestName: string, eventTitle: string, eventDate: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>See You Soon!</h2>
      <p>Hi <strong>${guestName}</strong>, this is a friendly reminder that <strong>${eventTitle}</strong> is coming up on:</p>
      <p style="font-size: 18px; font-weight: bold; color: #FF8FB1;">${new Date(eventDate).toLocaleString()}</p>
      <p>We look forward to celebrating with you and your little one at Kaylan Preschool.</p>
    </div>
  `;
}
