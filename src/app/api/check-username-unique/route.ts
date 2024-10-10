import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import VerificationModel from "@/models/verification.model";

const UsernameQuerySchema = z.object({
    username: usernameValidation
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        console.log(request)
        const { searchParams } = new URL(request.url);
        const username = searchParams.get('username');

        // Validate the username using Zod
        const result = UsernameQuerySchema.safeParse({ username });

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return new Response(
                JSON.stringify({
                    success: false,
                    message: usernameErrors.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check for existing users
        const existingVerifiedUser = await UserModel.findOne({ username });
        const existingUnverifiedUser = await VerificationModel.findOne({ username });

        if (existingVerifiedUser || existingUnverifiedUser) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: 'Username is already taken'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // If no existing user found, return success
        return new Response(
            JSON.stringify({
                success: true,
                message: 'Username is unique'
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error) {
        console.error("Error checking username", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error checking username"
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
