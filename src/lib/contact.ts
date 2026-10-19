type ContactForm = { type: "contact"; name: string; email: string; orderNumber: string; message: string };
type PartnerForm = { type: "partner"; company: string; contact: string; email: string; phone: string; message: string };

/** Sends a contact or partner form through the Vercel function in /api/contact. */
export async function sendForm(body: ContactForm | PartnerForm) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Form submission failed with status ${response.status}`);
  }
}
