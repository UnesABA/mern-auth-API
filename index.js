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
const multer    = require("multer")
const path      = require("path")

dotenv.config()

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
.catch((err) => console.error('Error connecting to MongoDB:', err))

app.use("/images", express.static(path.join(__dirname, "public", "images")))

// Middleware
app.use(helmet())
app.use(morgan("common"))
app.use(cors())

//indicate destination and file name 
const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, "public/images")
  }, 
  filename: (req, file, cb) => {
    const fileName = req.body.name || file.originalname;
    cb(null, fileName);
  }
})

const upload = multer({storage})
app.post("/api/upload", upload.single("file"), (req, res) =>{
  try {
    return res.status(200).json("File uploaded successfully ^^")
  } catch (error) {
    console.log(error)
    res.status(500).json("File upload failed")
  }
})

app.use(express.json())

// Routes
app.use("/api/users", userRoute)
app.use("/api/auth" , authRoute)
app.use("/api/posts", postRoute)

// app.listen(8800, () => {
//   console.log("Backend server is running on port 8800")
// })
