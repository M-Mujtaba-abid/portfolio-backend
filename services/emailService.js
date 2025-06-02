import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// Create transporter
const createTransporter = () => {
  if (process.env.EMAIL_SERVICE === "gmail") {
    return nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use App Password for Gmail
      },
    })
  }

  // Default SMTP configuration
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export const sendContactEmail = async ({ name, email, subject, message }) => {
  // Skip email sending if not configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️ Email service not configured, skipping email send")
    return
  }

  try {
    const transporter = createTransporter()

    // Email to you (notification)
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">New Contact Form Submission</h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            Sent from Portfolio Contact Form at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    }

    // Auto-reply to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting me!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Thank You for Your Message!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for reaching out! I've received your message and will get back to you within 24 hours.</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>
          <p>Best regards,<br>Ahmad Ali<br>Full Stack Developer</p>
        </div>
      `,
    }

    // Send both emails
    await transporter.sendMail(adminMailOptions)
    await transporter.sendMail(userMailOptions)
  } catch (error) {
    console.error("Email sending error:", error)
    throw new Error("Failed to send email")
  }
}
