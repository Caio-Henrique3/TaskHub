import { UserModel } from "../models/userModel";
import bcrypt from "bcrypt";

export class UserService {
  static async findAll() {
    return UserModel.find();
  }

  static findById(id: string) {
    return UserModel.findById(id);
  }

  static async register(email: string, password: string) {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error("Email já cadastrado.");
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
      throw new Error("Email já cadastrado.");
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedUser;
  }

  static async delete(id: string) {
    await UserModel.findByIdAndDelete(id);
  }
}
