import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    // Access the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    // Return an error response if the API key is missing
    if (!apiKey) {
        return NextResponse.json(
            { success: false, message: "Google Generative AI API key is missing." },
            { status: 400 }
        );
    }

    try {
        // Initialize GoogleGenerativeAI with the API key
        const genAI = new GoogleGenerativeAI(apiKey);

        // Get the model using the specified version (gemini-1.5-flash)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Define the prompt
        const prompt = "Create a list of three uplifting and supportive messages formatted as a single string. Each message should be separated by '||'. These messages are for an anonymous social messaging platform and should be suitable for a diverse audience. Focus on universal themes of encouragement and positivity, avoiding personal or sensitive topics. For example, your output should be structured like this: 'Believe in yourself; you’re capable of amazing things!||Remember, every day is a new opportunity to shine and grow!||You are not alone; your journey is unique and beautiful!'. Ensure the messages are inspiring and contribute to a positive and welcoming environment. Strictly keep the total length of each messages equal under 120 characters.";

        // Generate content using the model
        const result = await model.generateContent(prompt);

        // Return the generated result in the response
        return NextResponse.json({ success: true, data: result });
    } catch (error: any) {
        // Handle any errors and return the error response
        return NextResponse.json(
            { success: false, message: `Error generating AI content: ${error.message}` },
            { status: 500 }
        );
    }
}
