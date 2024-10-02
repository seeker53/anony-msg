import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { User } from "next-auth";
import { Message } from "@/models/message.model";
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
        const userWithMessages = await UserModel.aggregate([
            {
                // Match the user by their ID
                $match: { _id: userId }
            },
            {
                // Lookup the messages from the Message collection using the ObjectId references in the `messages` array
                $lookup: {
                    from: "messages",  // The name of the Message collection in MongoDB
                    localField: "messages",  // The field in User that contains the message IDs
                    foreignField: "_id",  // The field in Message that matches the message IDs
                    as: "messages",  // The name of the array where the populated messages will be stored
                }
            },
            {
                // Optionally sort the messages by createdAt in descending order (newest first)
                $project: {
                    _id: 1,
                    username: 1,
                    messages: {
                        $sortArray: { input: "$messages", sortBy: { createdAt: -1 } }
                    }
                }
            }
        ]);

        console.log("User with Messages:", userWithMessages);

        if (!userWithMessages || userWithMessages.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found or no messages available"
                }),
                { status: 404 }
            );
        }

        return new Response(
            JSON.stringify({
                success: true,
                messages: userWithMessages[0].messages  // Access the populated messages
            }),
            { status: 200 }
        );
        // const user = await UserModel.aggregate([
        //     { $match: { _id: userId } },
        //     { $project: { messages: 1 } }, // Get only the messages field
        //     { $unwind: "$messages" },       // Flatten the array of messages
        //     { $sort: { "messages.createdAt": -1 } }, // Sort by createdAt
        //     { $replaceRoot: { newRoot: "$messages" } }, // Replace root with the messages object
        // ]);
        // if (!user || user.length === 0) {
        //     return Response.json(
        //         {
        //             success: false,
        //             message: "User not found"
        //         },
        //         {
        //             status: 401
        //         }
        //     )
        // }
        // return Response.json(
        //     {
        //         success: true,
        //         messages: user[0].messages  // aggregation pipeline gives us array in which our concern is the first element of resultant array
        //     },
        //     {
        //         status: 200
        //     }
        // )
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