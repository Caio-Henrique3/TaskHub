import { Schema, model, InferSchemaType } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, maxlength: 100 },
  password: { type: String, required: true }
});

export type User = InferSchemaType<typeof UserSchema>;

export const UserModel = model<User>("User", UserSchema);