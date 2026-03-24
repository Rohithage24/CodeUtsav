import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
{
  authID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthUser",
    required: true,
    unique: true
  },

  name: {
    type: String,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    lowercase: true
  },

  password: {
    type: String
  },

  mobile: {
    type: String,
    required: true
  },

},
{
  timestamps: true
}
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;