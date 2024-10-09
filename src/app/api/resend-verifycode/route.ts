import dbConnect from "@/lib/dbConnect";
import VerificationModel from '@/models/verification.model'
import UserModel from "@/models/user.model";
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username } = await request.json();
        const decodedUsername = decodeURIComponent(username);

        const verifiedUser = await UserModel.findOne({ username: decodedUsername });
        if (verifiedUser) {
            return Response.json(
                { success: false, message: "User already verified, please signin" },
                { status: 401 }
            )
        }

        const unverifiedUser = await VerificationModel.findOne({ username: decodedUsername });
        if (!unverifiedUser) {
            return Response.json(
                { success: false, message: "User not found please signup again" },
                { status: 404 } // Change status code for user not found
            );
        }

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date()
        expiryDate.setMinutes(expiryDate.getMinutes() + 30);
        unverifiedUser.verifyCode = verifyCode;
        unverifiedUser.verifyCodeExpiry = expiryDate;
        await unverifiedUser.save();
        const emailResponse = await sendVerificationEmail(unverifiedUser.email, unverifiedUser.username, verifyCode)

        if (emailResponse.success) {
            return Response.json({
                success: true,
                message: "Verification code resent, please verify"
            }, {
                status: 201
            })
        } else {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            { success: false, message: "Error checking username" },
            { status: 500 }
        );
    }
}
