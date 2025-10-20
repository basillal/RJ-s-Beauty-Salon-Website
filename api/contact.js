import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  // Check env variables
  const { SMTP_USER, SMTP_PASS, RECEIVER_MAIL } = process.env;
  if (!SMTP_USER || !SMTP_PASS || !RECEIVER_MAIL) {
    console.error("Missing environment variables!");
    return res.status(500).json({ error: "Server misconfiguration." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });

    await transporter.sendMail({
      from: `"Website Contact" <${SMTP_USER}>`,
      to: RECEIVER_MAIL,
      replyTo: email,
      subject: subject || "Contact Form Message",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ error: "Failed to send message." });
  }
}
