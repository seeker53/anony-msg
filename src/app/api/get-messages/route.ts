import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth"
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "User not authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: "_id", messages: { $push: "$messages" } } },
        ])
        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }
        return Response.json(
            {
                success: true,
                messages: user[0].messages  // aggregation pipeline gives us array in which our concern is the first element of resultant array
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("failed to get messages", error)
        return Response.json(
            {
                success: false,
                message: "failed to get messages"
            },
            {
                status: 501
            }
        )
    }

}