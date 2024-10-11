'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast"
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar).map((msg) => msg.trim());
};


export default function SendMessage() {
    const params = useParams<{ username: string }>();
    const username = params.username;
    const { toast } = useToast();
    const [suggestions, setSuggestions] = useState<string[]>([
        "You've got this! Keep shining bright.",
        "Every day is a chance to create something amazing.",
        "Embrace the beauty of today, and let your light shine bright!"
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuggestLoading, setIsSuggestLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // State for errors

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch('content');

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-message', {
                ...data,
                username,
            });

            toast({
                title: response.data.message,
                variant: 'default',
            });
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to send message',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestedMessages = async () => {
        try {
            const response = await fetch('/api/generate-messages', { method: 'POST' });

            if (!response.ok) {
                throw new Error('Failed to fetch suggestions');
            }

            const data = await response.json();

            if (data.success) {
                const messageString = data.data.response.candidates[0].content.parts[0].text;
                // Split the string using the '||' delimiter
                const parsedSuggestions = parseStringMessages(messageString);

                setSuggestions(parsedSuggestions);
            } else {
                throw new Error(data.message || 'Error fetching suggestions');
            }
        } catch (err: any) {
            setError(err.message);
        }
    };



    return (
        <div className="container mx-auto my-10 p-8 max-w-2xl bg-white shadow-lg rounded-lg">
            {/* Top Call-to-Action Section */}
            <div className="bg-blue-100 p-6 mb-8 rounded-lg text-center">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">
                    Want your own message board?
                </h2>
                <p className="text-gray-700 mb-4">Create your account and start sharing!</p>
                <Link href={'/sign-up'}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
                        Create Your Account
                    </Button>
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                Send an Anonymous Message
            </h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg text-gray-800">Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here..."
                                        className="resize-none rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled className="px-6 py-3">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Sending...
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !messageContent} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md">
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="mt-10 space-y-4">
                <Button
                    onClick={fetchSuggestedMessages}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold rounded-md py-2"
                    disabled={isSuggestLoading}
                >
                    {isSuggestLoading ? 'Loading suggestions...' : 'Suggest AI generated Messages'}
                </Button>

                <div className="space-y-2">
                    <p className="text-gray-700">Click on any message below to select it:</p>
                    <div className="overflow-auto max-w-full">
                        <Card className="bg-gray-50 p-4 rounded-lg max-w-full">
                            <CardHeader>
                                <h3 className="text-lg font-medium text-gray-800">Suggested Messages</h3>
                            </CardHeader>
                            <CardContent className="flex flex-col space-y-3 overflow-hidden">
                                {error ? (
                                    <p className="text-red-500">{error}</p>
                                ) : (
                                    suggestions.map((message, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            className="bg-white border border-gray-300 rounded-md hover:bg-gray-100 w-full text-left break-words max-w-full p-2"
                                            onClick={() => handleMessageClick(message)}
                                        >
                                            {message}
                                        </Button>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Separator className="my-8" />
        </div>


    );
}
