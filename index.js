const express   = require("express")
const app       = express()
const mongoose  = require("mongoose")
const dotenv    = require("dotenv")
const helmet    = require("helmet")
const morgan    = require("morgan")
const cors      = require("cors")
const userRoute = require("./routes/users.js")
const authRoute = require("./routes/auth.js")
const postRoute = require("./routes/posts.js")

dotenv.config()

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
.catch((err) => console.error('Error connecting to MongoDB:', err))

// Middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())

// Routes
app.use("/api/users", userRoute)
app.use("/api/auth" , authRoute)
app.use("/api/posts", postRoute)

// app.listen(8800, () => {
//   console.log("Backend server is running on port 8800")
// })
