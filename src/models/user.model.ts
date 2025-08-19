import mongoose from "mongoose";
import { Document, Schema, model, mongo } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  analyzedRepo:string[]
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  analyzedRepo:[{type:String}]
});

export const UserModel = (mongoose.models.User as mongoose.Model<IUser>) ||  model<IUser>("User", userSchema);
