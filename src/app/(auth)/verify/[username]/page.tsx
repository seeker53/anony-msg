'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/schemas/verifySchema';

export default function VerifyAccount() {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true); // Start disabled
    const [countdown, setCountdown] = useState<number | null>(null);

    const handleResendCode = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>(`/api/resend-verifycode`, {
                username: params.username,
            });
            toast({
                title: 'Success',
                description: response.data.message,
            });
            setCountdown(120); // Start 120-second countdown
            setIsDisabled(true); // Disable the button again

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Error in resending verification code",
                description: axiosError.response?.data.message || "Unknown error",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username: params.username,
                verifyCode: data.code,
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
                description: axiosError.response?.data.message || 'An error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    };

    // Handle countdown logic and button enabling/disabling
    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            setIsDisabled(true); // Ensure the button is disabled during the countdown
            const intervalId = setInterval(() => {
                setCountdown((prev) => prev! - 1); // Decrement the countdown
            }, 1000);

            return () => clearInterval(intervalId); // Clean up the interval on unmount
        } else if (countdown === 0) {
            setIsDisabled(false); // Enable the button when countdown ends
            setCountdown(null);
        }
    }, [countdown]);

    // Check if this is the first page load
    useEffect(() => {
        const isFirstLoad = sessionStorage.getItem('isFirstLoad');

        if (!isFirstLoad) {
            // First load, start countdown
            setCountdown(120); // Set initial countdown to 120 seconds
            setIsDisabled(true); // Ensure button is disabled on first load
            sessionStorage.setItem('isFirstLoad', 'true');
        } else {
            // If it's not the first load, check countdown from localStorage
            const storedCountdown = localStorage.getItem('countdown');
            if (storedCountdown) {
                const remainingTime = parseInt(storedCountdown, 10);
                if (remainingTime > 0) {
                    setCountdown(remainingTime); // Restore countdown
                    setIsDisabled(true); // Disable the button while the countdown is ongoing
                } else {
                    setIsDisabled(false); // Enable the button if no countdown is active
                    setCountdown(null);
                }
            } else {
                setIsDisabled(false); // If no countdown, enable the button
                setCountdown(null);
            }
        }
    }, []);

    // Save countdown in localStorage whenever it changes
    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            localStorage.setItem('countdown', countdown.toString());
        } else {
            localStorage.removeItem('countdown');
        }
    }, [countdown]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button onClick={handleResendCode} disabled={isDisabled || isLoading} variant="default">
                            {isLoading ? 'Resending code...' : countdown !== null ? `Resend in ${countdown} s` : 'Resend Code'}
                        </Button>
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
