import express from "express";
import {
  createProfile,
  getProfile,
  updateProfile
} from "../Controller/user.controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();


// =============================================================================
//  POST /api/profile/createProfile
//  Create user profile
// =============================================================================
router.post("/createProfile", createProfile);


// =============================================================================
//  GET /api/profile/Profile      (Protected)
// =============================================================================
router.get("/Profile/:authID", getProfile);


// =============================================================================
//  PATCH /api/profile/Profile (Protected)
// =============================================================================
router.patch("/Profile", authMiddleware, updateProfile);


export default router;