import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/user.model'
import VerificationModel from '@/models/verification.model'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import mongoose from 'mongoose'

export async function POST(request: Request) {
    await dbConnect()
    console.log('Connected to MongoDB:', mongoose.connection.name);  // Log the database name

    try {
        const { username, email, password } = await request.json()

        const existingVerifiedUserByUsername = await UserModel.findOne({ username })
        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: 'Verified Username already exists'
            }, {
                status: 400
            })
        }

        const existingVerifiedUserByEmail = await UserModel.findOne({ email })
        if (existingVerifiedUserByEmail) {
            return Response.json({
                success: false,
                message: "Verified User already exists with this email"
            }, {
                status: 400
            })
        }
        const existingUnverifiedUserByUsername = await VerificationModel.findOne({ username })
        if (existingUnverifiedUserByUsername) {
            return Response.json({
                success: false,
                message: 'Unverified Username already exists'
            }, {
                status: 400
            })
        }

        const existingUnverifiedUserByEmail = await VerificationModel.findOne({ email })
        if (existingUnverifiedUserByEmail) {
            return Response.json({
                success: false,
                message: "Unverified User already exists with this email"
            }, {
                status: 400
            })
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 30);

        const newUser = new VerificationModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
        })
        await newUser.save()

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        } else {
            return Response.json({
                success: true,
                message: "User registered successfully. Please verify your email"
            }, {
                status: 201
            })
        }

    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
                success: false,
                message: 'Error registering user'
            },
            {
                status: 500
            }
        )
    }
}