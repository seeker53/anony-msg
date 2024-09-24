import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import MessageModel from "@/models/message.model";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username: username })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            )
        }
        // is user accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json(
                {
                    success: false,
                    message: "User not accepting messages"
                },
                {
                    status: 403
                }
            )
        }

        const newMessage = new MessageModel({ content, createdAt: new Date() })
        await newMessage.save();
        const messageId = new mongoose.Types.ObjectId(newMessage._id as string);
        user.messages.push(messageId)
        await user.save();
        return Response.json(
            {
                success: true,
                message: "Message sent successfully"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error adding messages", error)
        return Response.json(
            {
                success: false,
                message: "failed to send message"
            },
            {
                status: 500
            }
        )
    }
}