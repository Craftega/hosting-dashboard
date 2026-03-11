const router = require("express").Router()
const jwt = require("jsonwebtoken")

const admin={
 username:"admin",
 password:"admin123"
}

router.post("/login",(req,res)=>{

 const {username,password}=req.body

 if(username!==admin.username || password!==admin.password){
  return res.status(401).send("Invalid login")
 }

 const token = jwt.sign(
  {username},
  process.env.JWT_SECRET,
  {expiresIn:"1d"}
 )

 res.json({token})

})

module.exports=router