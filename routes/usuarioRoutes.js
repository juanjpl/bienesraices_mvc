import express from "express";
import { formularioLogin, formularioOlvidePassword, formularioRegistro } from "../controllers/usuarioController.js";

const router = express.Router();


//Routing
router.get("/login", formularioLogin);
router.get("/registro",formularioRegistro);
router.get("/olvide-password",formularioOlvidePassword);

/*
router.post("/",(req,res)=>{
    res.json({msg:"Respuesta POST"})
})
*/

/*
router.route("/")
.get(function(req,res){
    res.json({msg:"respuesta GET"});
})
.post(function(req,res){
    res.json({msg:"respuesta POST"});
})
    */

export default router;