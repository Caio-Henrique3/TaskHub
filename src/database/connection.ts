import mongoose from "mongoose";

export async function connectToDatabase(): Promise<void> {
  try {
    const uri = process.env.MONGO_URI as string;

    await mongoose.connect(uri);

    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB", error);

    process.exit(1);
  }
}
