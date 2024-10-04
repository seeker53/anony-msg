import dbConnect from "@/lib/dbConnect";
import VerificationModel from '@/models/verification.model'
import UserModel from "@/models/user.model";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const UnverifiedUser = await VerificationModel.findOne({ username: decodedUsername });

        if (!UnverifiedUser) {
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 } // Change status code for user not found
            );
        }

        const isCodeValid = UnverifiedUser.verifyCode === code;
        const isCodeNotExpired = new Date(UnverifiedUser.verifyCodeExpiry) > new Date();

        if (isCodeNotExpired && isCodeValid) {
            const newUser = new UserModel({
                username: decodedUsername,
                email: UnverifiedUser.email,
                password: UnverifiedUser.password,
                isAcceptingMessages: true,
                messages: [],
            })
            await newUser.save()
            await VerificationModel.deleteOne({ username: decodedUsername });

            return Response.json(
                { success: true, message: "Account verified successfully!" },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            return Response.json(
                { success: false, message: "Verification code expired" },
                { status: 400 }
            );
        } else {
            return Response.json(
                { success: false, message: "Incorrect verification code" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            { success: false, message: "Error checking username" },
            { status: 500 }
        );
    }
}
