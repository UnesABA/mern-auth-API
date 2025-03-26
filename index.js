// express → A lightweight web framework for handling API requests and routes.

// mongoose → Helps interact with MongoDB, making it easier to model and manage data.

// dotenv → Loads environment variables from a .env file (e.g., database URLs, API keys).

// helmet → Adds security headers to protect your app from common vulnerabilities.

// morgan → Logs HTTP requests in the terminal for debugging.

// nodemon → Automatically restarts the server when code changes (only used in development).

const express   = require("express")
const app       = express()
const mongoose  = require("mongoose")
const dotenv    = require("dotenv")
const helmet    = require("helmet")
const morgan    = require("morgan")
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

//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

app.use("/api/users", userRoute)
app.use("/api/auth" , authRoute)
app.use("/api/posts", postRoute)

// app.get("/", (req, res) =>{
//   res.send("Welcome to Homepage !")
// })
// app.get("/users", (req, res) =>{
//   res.send("Welcome to user page !")
// })

app.listen(8800, () =>{
  console.log("The backend server is Running !")
})