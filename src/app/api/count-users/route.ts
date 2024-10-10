import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

export async function GET() {
    await dbConnect();

    try {
        const userCount = await UserModel.countDocuments();

        return new Response(JSON.stringify({ userCount }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching total users:", error);
        return new Response(JSON.stringify({ error: "Failed to fetch total users" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}