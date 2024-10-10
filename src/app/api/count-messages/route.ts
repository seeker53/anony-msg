import dbConnect from "@/lib/dbConnect"; // Import your dbConnect function
import MessageModel from "@/models/message.model"; // Import your MessageModel

export async function GET() {
    // Ensure the database is connected
    await dbConnect();

    try {
        // Calculate the total number of messages in the messages collection
        const totalMessages = await MessageModel.countDocuments(); // Returns the total count

        // Return the total count as a JSON response
        return new Response(JSON.stringify({ totalMessages }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching total messages:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch total messages" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
