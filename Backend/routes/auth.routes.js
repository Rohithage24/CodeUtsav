import express from "express";
import {sendOtp , verifyOtp , loginWithEmail , logout} from "../Controller/auth.controller.js";

const router = express.Router();

router.post("/sendOtp" ,sendOtp );
router.post("/verifyOtp" , verifyOtp);
router.post("/loginWithEmail" , loginWithEmail);
router.get("/logout" , logout)

export default router;