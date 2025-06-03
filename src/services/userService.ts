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
}
