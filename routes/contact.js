import express from "express";
import rateLimit from "express-rate-limit";
import { sendContactEmail } from "../services/emailService.js";
import { validateContactForm } from "../middleware/validation.js";
import Contact from "../models/Contact.js"; // <--- ✅ Add this

const router = express.Router();

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 contact form submissions per windowMs
  message: {
    error: "Too many contact form submissions",
    message: "Please wait before sending another message.",
  },
});

// POST /api/contact
router.post("/", contactLimiter, validateContactForm, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await Contact.create({ name, email, subject, message }); // ✅ Save to MongoDB

    // Log the contact form submission
    console.log("📧 New contact form submission:", {
      name,
      email,
      subject,
      timestamp: new Date().toISOString(),
      ip: req.ip,
    });

    // Send email (if email service is configured)
    try {
      await sendContactEmail({ name, email, subject, message });
      console.log("✅ Email sent successfully");
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
      // Continue even if email fails - we still want to log the submission
    }

    // Store in database (if database is configured)
    // await saveContactSubmission({ name, email, subject, message })

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
      data: {
        name,
        email,
        subject,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: "Failed to send message. Please try again later.",
    });
  }
});

// GET /api/contact (for testing)
router.get("/", async (req, res) => {
  const contacts = await Contact.find();

  res.status(200).json({
    message: "Contact API is working",
    contacts,
  });
});

export default router;
