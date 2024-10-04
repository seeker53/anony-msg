import mongoose, { Schema, Document } from 'mongoose';
import { Message } from './message.model';

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    isAcceptingMessages: boolean;
    messages: (mongoose.Types.ObjectId | Message)[]; // Reference to Message IDs
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] // Referencing Message IDs
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>('User', UserSchema));

export default UserModel;
