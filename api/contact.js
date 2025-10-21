import nodemailer from "nodemailer";

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Please fill all required fields." });
  }

  // Check environment variables
  const { SMTP_USER, SMTP_PASS, SMTP_HOST, SMTP_PORT, RECEIVER_MAIL } = process.env;
  
  if (!SMTP_USER || !SMTP_PASS || !RECEIVER_MAIL) {
    console.error("Missing required environment variables: SMTP_USER, SMTP_PASS, or RECEIVER_MAIL");
    return res.status(500).json({ error: "Server configuration error. Please contact administrator." });
  }

  try {
    // Configure SMTP transporter with better settings for Vercel
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST || "smtp.gmail.com",
      port: parseInt(SMTP_PORT || "587"),
      secure: false, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      },
      // Important for Vercel serverless functions
      pool: false, // Disable connection pooling for serverless
      connectionTimeout: 5000, // 5 seconds timeout
      greetingTimeout: 5000,
      socketTimeout: 10000,
      // For Gmail, you may need these settings
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2"
      }
    });

    // Verify connection configuration (optional but helpful for debugging)
    await transporter.verify().catch(err => {
      console.error("SMTP connection verification failed:", err.message);
      throw new Error("SMTP server connection failed");
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Website Contact Form" <${SMTP_USER}>`,
      to: RECEIVER_MAIL,
      replyTo: email,
      subject: subject || "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "No subject"}</p>
          <hr>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `
    });

    console.log("Email sent successfully:", info.messageId);
    return res.status(200).json({ ok: true, message: "Email sent successfully" });
    
  } catch (err) {
    console.error("Error sending email:", err);
    
    // Return more specific error messages
    let errorMessage = "Failed to send message. Please try again later.";
    
    if (err.code === "EAUTH") {
      errorMessage = "Email authentication failed. Please contact administrator.";
      console.error("SMTP Authentication Error - Check credentials");
    } else if (err.code === "ETIMEDOUT" || err.code === "ECONNECTION") {
      errorMessage = "Connection timeout. Please try again.";
      console.error("SMTP Connection/Timeout Error");
    } else if (err.code === "EENVELOPE") {
      errorMessage = "Invalid email address.";
    }
    
    return res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
}
