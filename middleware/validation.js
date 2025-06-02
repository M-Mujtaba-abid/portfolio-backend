export const validateContactForm = (req, res, next) => {
  const { name, email, subject, message } = req.body

  // Check required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "All fields are required",
      missing: {
        name: !name,
        email: !email,
        subject: !subject,
        message: !message,
      },
    })
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Invalid email format",
    })
  }

  // Validate field lengths
  if (name.length > 100) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Name must be less than 100 characters",
    })
  }

  if (subject.length > 200) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Subject must be less than 200 characters",
    })
  }

  if (message.length > 2000) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: "Message must be less than 2000 characters",
    })
  }

  // Sanitize inputs (basic)
  req.body.name = name.trim()
  req.body.email = email.trim().toLowerCase()
  req.body.subject = subject.trim()
  req.body.message = message.trim()

  next()
}
