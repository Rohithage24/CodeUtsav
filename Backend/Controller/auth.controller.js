// controllers/auth.controllers.js

import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import AuthUser from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import Profile from "../models/user.model.js";

dotenv.config();

dotenv.config();

const OTP_MAX_ATTEMPTS = 3;
const OTP_EXPIRY_MS = (parseInt(process.env.OTP_EXPIRY_MINUTES) || 5) * 60 * 1000;

// ── Cookie options ────────────────────────────────────────────────────────────
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

// ── Send OTP via Twilio or Mock ───────────────────────────────────────────────
const dispatchOtp = async (mobile, otp) => {

  if (process.env.USE_MOCK_OTP === "true") {
    console.log(`📱 [MOCK OTP] Mobile: ${mobile} | OTP: ${otp}`);
    return;
  }

  const twilio = (await import("twilio")).default;

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  await client.messages.create({
    body: `Your OTP is ${otp}. Valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes. Do not share it`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: mobile,
  });
};


const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, mobile: user.mobile },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );


export const sendOtp = async (req, res) => {
  try {
    const mobile = String(req.body.mobile || "").trim();
    console.log(mobile);
    

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

  
    if (!/^\+?[1-9]\d{7,14}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number format. Use +91XXXXXXXXXX",
      });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MS);


    let user = await AuthUser.findOne({ mobile });
    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.otpAttempts = 0;
    } else {
      user = new AuthUser({ mobile, otp, otpExpiry, otpAttempts: 0 });
    }
    await user.save();
    console.log("oto :",otp);
    

    await dispatchOtp(mobile, otp);

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${mobile}. ${otp}Valid for ${process.env.OTP_EXPIRY_MINUTES || 5} minutes.`,
      otp : otp,
    });
  } catch (error) {
    console.error("sendOtp error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


export const verifyOtp = async (req, res) => {
  try {
    const mobile = String(req.body.mobile || "").trim();
    const otp = String(req.body.otp || "").trim();

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile and OTP are required",
      });
    }

    const user = await AuthUser.findOne({ mobile });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Mobile not registered. Please request an OTP first.",
      });
    }

    if (user.otpAttempts >= OTP_MAX_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: "Too many wrong attempts. Please request a new OTP.",
      });
    }


    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(410).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }


    if (user.otp !== otp) {
      user.otpAttempts += 1;
      await user.save();
      const remaining = OTP_MAX_ATTEMPTS - user.otpAttempts;
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${remaining} attempt(s) remaining.`,
      });
    }
    // Issue JWT
    const token = generateToken(user);


    user.clearOtp();
    user.isVerified = true;
    user.token = token;
    await user.save();



    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,                      
      data: {
        user: {
          id: user._id,
          mobile: user.mobile,
          name: user.name,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




export const loginWithEmail = async (req, res) => {
  try {

    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "").trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user profile
    const profile = await Profile.findOne({ email });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, profile.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const authUser = await AuthUser.findById(profile.authID);

    if (!authUser) {
      return res.status(404).json({
        success: false,
        message: "Authentication record not found",
      });
    }


    const token = generateToken(authUser);

    authUser.token = token;
    await authUser.save();


    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: authUser._id,
          name: profile.name,
          email: profile.email,
          mobile: authUser.mobile,
          isVerified: authUser.isVerified,
        },
      },
    });

  } catch (error) {

    console.error("loginWithEmail error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};



export const logout = async (req, res) => {
  try {
    res.clearCookie("token", { path: "/" });
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("logout error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};




