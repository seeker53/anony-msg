'use client'

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X, AlertTriangle, CheckCircle } from 'lucide-react'; // Icons for harmful and safe messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { Message } from "@/models/message.model"
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from '@/types/ApiResponse';

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isBlurred, setIsBlurred] = useState(message.isHarmful); // Initially blur if harmful

    const handleDeleteConfirm = async () => {
        setIsDeleting(true); // Show loading state for delete action
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
            toast({
                title: response.data.message,
            });
            onMessageDelete(message._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        } finally {
            setIsDeleting(false); // End loading state
        }
    };

    const handleBlurToggle = () => {
        setIsBlurred(!isBlurred); // Toggle blur state when clicked
    };

    return (
        <Card className="border border-gray-300 shadow-md p-4 mb-4 rounded-lg">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                    {/* Message indicator */}
                    <div className={`flex items-center ${message.isHarmful ? 'text-red-500' : 'text-green-500'} font-semibold`}>
                        {message.isHarmful ? (
                            <>
                                <AlertTriangle className="mr-2 w-5 h-5 animate-bounce" />
                                Harmful Message
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 w-5 h-5 animate-pulse" />
                                Safe Message
                            </>
                        )}
                    </div>

                    {/* Delete button */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant='destructive' size="icon" disabled={isDeleting}>
                                {isDeleting ? (
                                    <span className="animate-spin">
                                        <X className="w-5 h-5 text-gray-400" />
                                    </span>
                                ) : (
                                    <X className="w-5 h-5" />
                                )}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-lg font-bold text-gray-900">
                                    Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-sm text-gray-600">
                                    This action cannot be undone. Once deleted, the message will be permanently removed.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel asChild>
                                    <Button variant="outline" className="mr-2">
                                        Cancel
                                    </Button>
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteConfirm}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                {/* Timestamp */}
                <div className="text-xs text-gray-500">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>

            <CardContent className="pt-2">
                <div
                    className={`${isBlurred ? 'blur-sm' : ''
                        } cursor-pointer text-gray-800`}
                    onClick={handleBlurToggle}
                >
                    {isBlurred ? (
                        <div className="italic text-gray-500">
                            Click to reveal message
                        </div>
                    ) : (
                        message.content
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MessageCard;
