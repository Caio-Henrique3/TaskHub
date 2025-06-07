import { FilterQuery } from "mongoose";
import { Task, TaskModel } from "../models/taskModel";

export class TaskService {
  static async findAll(filters: FilterQuery<any>) {
    return TaskModel.find(filters).populate("user", "-password");
  }

  static findById(id: string) {
    return TaskModel.findById(id).populate("user", "-password");
  }

  static create(task: Task) {
    return new TaskModel(task).save();
  }

  static async update(id: string, updateData: Task) {
    return await TaskModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  static async delete(id: string) {
    await TaskModel.findByIdAndDelete(id);
  }
}
