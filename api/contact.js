import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // Basic CORS (tighten for production if needed)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { name, email, subject, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  const {
    SMTP_HOST = "smtp.gmail.com",
    SMTP_PORT = "465",
    SMTP_USER,
    SMTP_PASS,
    RECEIVER_MAIL,
  } = process.env;

  if (!SMTP_USER || !SMTP_PASS || !RECEIVER_MAIL) {
    console.error("Missing environment variables: SMTP_USER, SMTP_PASS, RECEIVER_MAIL");
    return res.status(500).json({ error: "Server misconfiguration." });
  }

  try {
    const port = Number(SMTP_PORT) || 465;
    const secure = port === 465; // SSL on 465, STARTTLS on 587 (secure=false)

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      tls: { rejectUnauthorized: false },
    });

    // Optional: verify connection for easier debugging
    await transporter.verify();

    const mailOptions = {
      from: `"Website Contact" <${SMTP_USER}>`,
      to: RECEIVER_MAIL,
      replyTo: email,
      subject: subject || "Contact Form Message",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${String(message).replace(/\n/g, "<br>")}</p>`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ error: "Failed to send message." });
  }
}