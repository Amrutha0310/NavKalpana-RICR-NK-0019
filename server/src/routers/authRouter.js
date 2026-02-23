import express from "express";
import {UserLogin,UserRegister} from "../controllers/authController.js"
import { UserLogout } from "../controllers/authController.js";

 const router = express.Router();

 router.post("/register",UserRegister);
 router.post("/login",UserLogin);
router.get("/logout", UserLogout);


 // otp/password
//  router.post("/genOtp", UserGenOTP);
// router.post("/verifyOtp", UserVerifyOtp);
// router.post("/forgetPassword",ProtectOtp, UserForgetPassword)

 export default router;
 