async function login(){

 const r = await fetch("http://localhost:3000/auth/login",{
  method:"POST",
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({
   username:document.getElementById("user").value,
   password:document.getElementById("pass").value
  })
 })

 const data = await r.json()

 localStorage.token=data.token

 window.location="dashboard.html"

}