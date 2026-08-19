import { Schema, model, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type Role = "parent" | "teacher" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

interface IUserModel extends Model<IUser> {}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["parent", "teacher", "admin"], default: "parent" },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  next();
});

export const User = model<IUser, IUserModel>("User", userSchema);
