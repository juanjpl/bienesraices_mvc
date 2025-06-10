const express= require("express");

//crear la app
const app = express();

//Routing
app.get("/", function(req,res){
    res.send("Hola mundo en express desde index")
})

app.get("/json", function(req,res){
    res.json({msg:"Hola mundo con un json"})
})

app.get("/json", function(req,res){
    res.render({msg:"Hola mundo con un json"})
})

app.get("/nosotros", function(req,res){
    res.send("Informacion de nosotros")
})


//Definir un puerto y arrancar el proyecto
const port = 3000;

app.listen(port,()=>{
    console.log(`El servidor está funcionando en el puerto: ${port}`)
})