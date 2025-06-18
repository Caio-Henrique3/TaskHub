import { Schema, model, Document } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, maxlength: 100 },
  password: { type: String, required: true },
});

export const UserModel = model<User>("User", UserSchema);

export interface IUser extends Document {
  email: string;
  password: string;
}

export interface User {
  email: string;
  password: string;
}

export interface UserResponse {
  _id?: string;
  email: string;
}
