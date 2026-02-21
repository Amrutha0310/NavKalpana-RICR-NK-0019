import express from "express";
import {UserLogin} from "../controllers/authController.js"


 const router = express.Router();

 // register(post)
 router.post("/login",UserLogin);
 // logout(get)


 // otp/password

 export default router;
 