import mongoose, { Schema, Document } from "mongoose"

export interface Message extends Document {
    content: string;
    createdAt: Date;
    isHarmful: boolean;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    isHarmful: {
        type: Boolean,
        required: true,
        default: false
    }
})
// Adding indexes
MessageSchema.index({ content: 'text' });  // Text index for full-text search on content
MessageSchema.index({ createdAt: 1 });  // Ascending index on createdAt for efficient sorting

// Middleware to perform AI validation on message content before saving
MessageSchema.pre("save", async function (next) {
    const message = this as Message;
    try {
        const aiResult = await validateContentWithAI(message.content);
        message.isHarmful = aiResult.score >= 0.7;
    } catch (error: any) {
        next(error);
    }
    next();
});

async function validateContentWithAI(content: string) {
    // Simulated response from AI model
    return {
        score: 0.65,  // Example score
        label: "non-harmful"
    };
}

const MessageModel = (mongoose.models.Message as mongoose.Model<Message>) || (mongoose.model<Message>('Message', MessageSchema));

export default MessageModel;