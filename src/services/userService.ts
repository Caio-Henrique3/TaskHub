import { UserModel } from "../models/userModel";
import bcrypt from "bcrypt";
import { ValidationError } from "../utils/errors";
import { FilterQuery } from "mongoose";

export class UserService {
  static async findAll(filters: FilterQuery<any>, limit = 10, skip = 0) {
    return UserModel.find(filters).limit(limit).skip(skip);
  }

  static findById(id: string) {
    return UserModel.findById(id);
  }

  static async register(email: string, password: string) {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new ValidationError("Email já cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({ email, password: hashedPassword });
    await user.save();

    return user;
  }

  static async update(
    id: string,
    updateData: Partial<{ email: string; password: string }>
  ) {
    const user = await UserModel.findOne({ email: updateData.email });
    if (user && user.id !== id) {
      throw new ValidationError("Email já cadastrado.");
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  static async delete(id: string) {
    return await UserModel.findByIdAndDelete(id);
  }

  static async count(filters: FilterQuery<any>) {
    return UserModel.countDocuments(filters);
  }
}
