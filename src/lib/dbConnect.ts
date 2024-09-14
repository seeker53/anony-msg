import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

        // Update connection state when connected
        connection.isConnected = db.connections[0].readyState;

        console.log("Database connected successfully!");

        // Listen to mongoose connection events
        mongoose.connection.on("disconnected", () => {
            console.log("Database disconnected");
            connection.isConnected = 0; // Reset the connection state
        });

        mongoose.connection.on("reconnected", () => {
            console.log("Database reconnected");
            connection.isConnected = 1; // Update the connection state
        });

        mongoose.connection.on("error", (err) => {
            console.error("Database connection error:", err);
            connection.isConnected = 0; // Update the state if an error occurs
        });
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1); // Exit if the connection fails
    }
}

export default dbConnect;
