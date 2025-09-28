import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

interface ConnectionState {
  isConnected: number;
}

const connection: ConnectionState = {
  isConnected: 0,
};

async function dbConnect(): Promise<void> {
  try {
    // Check if we have an existing connection
    if (connection.isConnected) {
      console.log("Using existing database connection");
      return;
    }

    // Configure mongoose options
    const opts = {
      bufferCommands: true,
      autoCreate: true,
      autoIndex: true,
    };

    // Create new connection
    const db = await mongoose.connect(MONGODB_URI as string, opts);

    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // Handle process termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination");
      process.exit(0);
    });

  } catch (error) {
    console.error("Database connection error:", error);
    throw error; // Re-throw to handle it in the calling code
  }
}

export default dbConnect;