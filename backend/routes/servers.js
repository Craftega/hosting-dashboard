const router=require("express").Router()
const api=require("../config/pterodactyl")

router.get("/",async(req,res)=>{

 const r=await api.get("/servers")
 res.json(r.data)

})

router.post("/:id/start",async(req,res)=>{

 await api.post(
  "/../client/servers/"+req.params.id+"/power",
  {signal:"start"}
 )

 res.send("started")

})

router.post("/:id/stop",async(req,res)=>{

 await api.post(
  "/../client/servers/"+req.params.id+"/power",
  {signal:"stop"}
 )

 res.send("stopped")

})

module.exports=router