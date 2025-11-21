import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  name: String,
  loginCount: { type: Number, default: 1 },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
