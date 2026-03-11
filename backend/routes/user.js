const router=require("express").Router()
const api=require("../config/pterodactyl")

router.get("/",async(req,res)=>{

 const r=await api.get("/users")
 res.json(r.data)

})

router.post("/",async(req,res)=>{

 const r=await api.post("/users",req.body)
 res.json(r.data)

})

router.delete("/:id",async(req,res)=>{

 await api.delete("/users/"+req.params.id)
 res.send("deleted")

})

module.exports=router