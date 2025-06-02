import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import rateLimit from "express-rate-limit"
import contactRoutes from "./routes/contact.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
})
app.use(limiter)

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Logging middleware
app.use(morgan("combined"))

// Routes
app.use("/api/contact", contactRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Portfolio API is running",
    timestamp: new Date().toISOString(),
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack)
  res.status(500).json({
    error: "Internal Server Error",
    message: process.env.NODE_ENV === "development" ? err.message : "Something went wrong!",
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📧 Contact API: http://localhost:${PORT}/api/contact`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`)
})
