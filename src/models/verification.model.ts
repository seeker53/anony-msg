import mongoose, { Schema, Document } from "mongoose";

export interface Verification extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
}

const VerificationSchema: Schema<Verification> = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyCode: {
        type: String,
        required: true
    },
    verifyCodeExpiry: {
        type: Date,
        required: true
    }
})

const VerificationModel = mongoose.models.Verification || mongoose.model<Verification>("Verification", VerificationSchema);

export default VerificationModel;