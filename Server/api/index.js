import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from '../api/routes/user.routes.js'
import authRoutes from '../api/routes/auth.routes.js'

dotenv.config()

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log(`MongoDb is connected!`)
})
.catch((err) => {
    console.log(err)
})

const app = express()

app.use(express.json())

app.use(cors())

app.listen(3000, () => {
    console.log(`Server is running on port 3000!`)
})

app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)

//error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})