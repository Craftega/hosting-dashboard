const express=require("express")
const cors=require("cors")
require("dotenv").config()

const auth=require("./routes/auth")
const users=require("./routes/users")
const servers=require("./routes/servers")
const authMiddleware=require("./middleware/auth")

const app=express()

app.use(cors())
app.use(express.json())

app.use("/auth",auth)
app.use("/users",authMiddleware,users)
app.use("/servers",authMiddleware,servers)

app.listen(process.env.PORT,()=>{
 console.log("Dashboard running")
})