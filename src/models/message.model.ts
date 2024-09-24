import mongoose, { Schema, Document } from "mongoose";
import { checkIfHarmful } from "@/helpers/moderation"; // Ensure this path is correct

export interface Message extends Document {
    content: string;
    createdAt: Date;
    isHarmful: boolean;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isHarmful: {
        type: Boolean,
        required: true,
        default: false,
    },
});

// Adding indexes
MessageSchema.index({ content: 'text' });  // Text index for full-text search on content
MessageSchema.index({ createdAt: 1 });     // Ascending index on createdAt for efficient sorting

// Middleware to perform content moderation check before saving
MessageSchema.pre("save", async function (next) {
    const message = this as Message;

    try {
        // Call moderation API to check if the content is harmful
        const moderationResult = await checkIfHarmful(message.content);

        // Flag the message as harmful if any label is not neutral
        message.isHarmful = moderationResult.flagged ||
            moderationResult.nsfw?.label !== 'NEUTRAL' ||
            moderationResult.toxicity?.label !== 'NEUTRAL' ||
            moderationResult.sexual?.label !== 'NEUTRAL' ||
            moderationResult.self_harm?.label !== 'NEUTRAL' ||
            moderationResult.violence?.label !== 'NEUTRAL';

        // You can optionally log or store other data from the moderation response
        console.log(`Moderation result: `, moderationResult);
    } catch (error: any) {
        return next(error);
    }

    next();
});

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) ||
    (mongoose.model<Message>('Message', MessageSchema));

export default MessageModel;
