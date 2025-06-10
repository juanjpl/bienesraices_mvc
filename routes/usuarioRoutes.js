import express from "express";

const router = express.Router();


//Routing
router.get("/login",(req,res)=>{
    res.render("auth/login",{
        autenticado:true
    });
})

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