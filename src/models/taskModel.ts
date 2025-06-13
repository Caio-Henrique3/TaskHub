import { InferSchemaType, model, Schema } from "mongoose";

const TaskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  suggestedStartDate: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setHours(now.getHours() + Number(process.env.TIME_ZONE) || 0);
      return now;
    },
  },
  completionDeadline: {
    type: Date,
    default: () => {
      const now = new Date();
      now.setHours(now.getHours() + Number(process.env.TIME_ZONE) || 0);
      return now;
    },
  },
  completionDate: { type: Date },
  appellant: { type: Boolean, default: false },
  recurrenceEndDate: { type: Date },
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
  parentTask: { type: Schema.Types.ObjectId, ref: "Task" },
});

export type Task = InferSchemaType<typeof TaskSchema>;

export const TaskModel = model<Task>("Task", TaskSchema);
