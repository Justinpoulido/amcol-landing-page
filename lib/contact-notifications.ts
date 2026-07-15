import "server-only";

type ContactNotification = {
  id?: string;
  fullName: string;
  email: string;
  company: string;
  phone: string;
  projectType: string;
  urgency: string;
  message: string;
  sourcePage: string;
  createdAt?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;
const notificationTo = process.env.CONTACT_NOTIFICATION_TO;
const notificationFrom = process.env.CONTACT_NOTIFICATION_FROM;

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderText(notification: ContactNotification) {
  const fields = [
    ["Name", notification.fullName],
    ["Email", notification.email],
    ["Company", notification.company || "Not provided"],
    ["Phone", notification.phone || "Not provided"],
    ["Project type", notification.projectType || "Not provided"],
    ["Urgency", notification.urgency || "Not provided"],
    ["Source page", notification.sourcePage],
    ["Request ID", notification.id || "Not available"],
    ["Submitted at", notification.createdAt || "Not available"],
  ];

  return [
    "A new AMCOL contact request was submitted.",
    "",
    ...fields.map(([label, value]) => `${label}: ${value}`),
    "",
    "Message:",
    notification.message || "No message provided.",
  ].join("\n");
}

function renderHtml(notification: ContactNotification) {
  const fields = [
    ["Name", notification.fullName],
    ["Email", notification.email],
    ["Company", notification.company || "Not provided"],
    ["Phone", notification.phone || "Not provided"],
    ["Project type", notification.projectType || "Not provided"],
    ["Urgency", notification.urgency || "Not provided"],
    ["Source page", notification.sourcePage],
    ["Request ID", notification.id || "Not available"],
    ["Submitted at", notification.createdAt || "Not available"],
  ];

  const rows = fields
    .map(
      ([label, value]) => `
        <tr>
          <th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#374151;width:140px;">${escapeHtml(label)}</th>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#111827;">${escapeHtml(value)}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.5;">
      <h1 style="font-size:20px;margin:0 0 16px;">New AMCOL contact request</h1>
      <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e5e7eb;">
        ${rows}
      </table>
      <h2 style="font-size:16px;margin:24px 0 8px;">Message</h2>
      <div style="white-space:pre-wrap;background:#f9fafb;border:1px solid #e5e7eb;padding:12px;max-width:720px;">${escapeHtml(
        notification.message || "No message provided.",
      )}</div>
    </div>`;
}

export function hasContactNotificationConfig() {
  return Boolean(resendApiKey && notificationTo && notificationFrom);
}

export async function sendContactNotification(
  notification: ContactNotification,
) {
  if (!hasContactNotificationConfig()) {
    console.warn(
      "Contact notification email skipped. Set RESEND_API_KEY, CONTACT_NOTIFICATION_TO, and CONTACT_NOTIFICATION_FROM.",
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: notificationFrom,
      to: notificationTo!.split(",").map((email) => email.trim()),
      reply_to: notification.email,
      subject: `New contact request from ${notification.fullName}`,
      text: renderText(notification),
      html: renderHtml(notification),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend email failed: ${response.status} ${errorText}`);
  }
}
