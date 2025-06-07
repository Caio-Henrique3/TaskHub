import { InferSchemaType, model, Schema } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  creationDate: { type: Date, default: Date.now },
  completionDeadline: { type: Date },
  completionDate: { type: Date },
  appellant: { type: Boolean, default: false },
  recurrence: {
    type: String,
    enum: ["daily", "weekly", "monthly", "annual"],
  },
  status: {
    type: String,
    enum: ["pending", "started", "completed", "canceled"],
    required: true,
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export type Task = InferSchemaType<typeof TaskSchema>;

export const TaskModel = model<Task>("Task", TaskSchema);
