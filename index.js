// ------ > const express= require("express");  // common js en package.json

import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";

//crear la app
const app = express();

//Habilitar Pug
app.set("view engine", "pug");
app.set("views","./views");

//Carpeta pulica 
app.use(express.static("public"));

//Routing
app.use("/auth", usuarioRoutes);



//Definir un puerto y arrancar el proyecto
const port = 3000;

app.listen(port,()=>{
    console.log(`El servidor está funcionando en el puerto: ${port}`)
})