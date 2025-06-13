import { FilterQuery } from "mongoose";
import { Task, TaskModel } from "../models/taskModel";

export class TaskService {
  static async findAll(filters: FilterQuery<any>, limit = 10, skip = 0) {
    return TaskModel.find(filters)
      .populate("user", "-password")
      .limit(limit)
      .skip(skip);
  }

  static findById(id: string) {
    return TaskModel.findById(id).populate("user", "-password");
  }

  static create(task: Task) {
    return new TaskModel(task).save();
  }

  static async createMany(tasks: Task[]) {
    return TaskModel.insertMany(tasks);
  }

  static async update(id: string, updateData: Task) {
    return await TaskModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  static async delete(id: string) {
    return await TaskModel.findByIdAndDelete(id);
  }

  static async count(filters: FilterQuery<any>) {
    return TaskModel.countDocuments(filters);
  }
}
