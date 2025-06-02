// // config/db.js
// import mongoose from "mongoose"

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     console.log("✅ MongoDB connected successfully")
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message)
//     process.exit(1)
//   }
// }

// export default connectDB
import mongoose from "mongoose"

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI
    if (!uri) {
      throw new Error("❌ MONGO_URI is not defined in .env file")
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("✅ MongoDB connected successfully")
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message)
    process.exit(1)
  }
}

export default connectDB
