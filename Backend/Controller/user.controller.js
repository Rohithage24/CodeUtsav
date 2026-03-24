// Controller/user.controller.js

import dotenv   from "dotenv";
import bcrypt   from "bcryptjs";         // ✅ FIX: was imported but never used for hashing
import AuthUser from "../models/auth.model.js";
import Profile  from "../models/user.model.js";

dotenv.config();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/profile/createProfile
// Body: { authID, name, email, password, mobile }
// ─────────────────────────────────────────────────────────────────────────────
export const createProfile = async (req, res) => {
  try {
    const { authID, name, email, password, mobile } = req.body;
    console.log(req.body);

    // 1️⃣ Validate required fields
    if (!authID || !mobile) {
      return res.status(400).json({
        success: false,
        message: "authID and mobile are required",
      });
    }

    // 2️⃣ Check Auth User exists
    const authUser = await AuthUser.findById(authID);
    if (!authUser) {
      return res.status(404).json({
        success: false,
        message: "Authentication user not found",
      });
    }

    // 3️⃣ Check if profile already exists
    const existingProfile = await Profile.findOne({ authID });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists",
      });
    }

    // 4️⃣ Hash password if provided
    let hashedPassword = null;
    if (password) {
      const salt    = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt); // ✅ FIX: was commented out
    }

    // 5️⃣ Create profile
    const newProfile = new Profile({
      authID,
      name,
      email,
      password: hashedPassword, // ✅ FIX: was `Password` (capital P → ReferenceError crash)
      mobile,
    });

    await newProfile.save();

    return res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data:    newProfile,
    });
  } catch (error) {
    console.error("createProfile error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/profile/Profile/:authID
// ─────────────────────────────────────────────────────────────────────────────
export const getProfile = async (req, res) => {
  try {
    const { authID } = req.params;
    console.log(authID);

    if (!authID) {
      return res.status(400).json({ success: false, message: "authID is required" });
    }

    const profile = await Profile.findOne({ authID });

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Profile fetched",
      data: {
        user: {
          id:        profile._id,
          authID:    profile.authID,
          name:      profile.name,
          email:     profile.email,
          mobile:    profile.mobile,
          createdAt: profile.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PATCH /api/profile/Profile  (Protected)
// Body: { name, email }
// ─────────────────────────────────────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const profile = await Profile.findOne({ authID: req.user._id }); // ✅ FIX: use _id not req.user

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    if (name && String(name).trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters",
      });
    }

    if (name)  profile.name  = String(name).trim();
    if (email) profile.email = String(email).trim().toLowerCase();

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          id:     profile._id,
          authID: profile.authID,
          name:   profile.name,
          email:  profile.email,
          mobile: profile.mobile,
        },
      },
    });
  } catch (error) {
    console.error("updateProfile error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};