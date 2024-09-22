'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';
import { useEffect } from 'react';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });

    useEffect(() => {
        const checkUserExists = async () => {
            try {
                const response = await axios.get(`/api/check-username?username=${params.username}`);
                if (!response.data.success) {
                    // Redirect to sign-up if the user does not exist
                    router.push('/sign-up');
                }
            } catch (error) {
                // Handle error (optional)
                console.error("Error checking username:", error);
                router.push('/sign-up'); // Redirect on error as well
            }
        };

        checkUserExists();
    }, [params.username, router]);

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            toast({
                title: 'Success',
                description: response.data.message,
            });

            router.replace('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Verification Failed',
                description:
                    axiosError.response?.data.message ?? 'An error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
            <div className="w-full max-w-md p-10 space-y-6 bg-white rounded-lg shadow-xl border border-gray-300">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-800 lg:text-4xl mb-4">
                        Verify Your Account
                    </h1>
                    <p className="text-gray-600 mb-2">
                        Enter the verification code sent to your email
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Verification Code</FormLabel>
                                    <Input {...field} className="border-2 border-gray-300 rounded-lg p-2" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Verify
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
