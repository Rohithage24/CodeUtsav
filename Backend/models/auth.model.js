import mongoose from 'mongoose'

const authSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      match: [/^\+?[1-9]\d{7,14}$/, 'Invalid mobile number format']
    },

    name: {
      type: String,
      trim: true,
      default: null
    },

    isVerified: {
      type: Boolean,
      default: false
    },
    lastVisitDate: {
      type: String, // YYYY-MM-DD
      default: null
    },
    dayVisit: {
      type: Boolean,
      default: false
    },
    otp: {
      type: String,
      default: null
    },

    otpExpiry: {
      type: Date,
      default: null
    },

    token: {
      type: String,
      default: null
    },

    otpAttempts: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

authSchema.methods.clearOtp = function () {
  this.otp = null
  this.otpExpiry = null
  this.otpAttempts = 0
}

const AuthUser = mongoose.model('AuthUser', authSchema)

export default AuthUser
