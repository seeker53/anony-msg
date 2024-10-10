'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const SignUpPage = () => {
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState("")
    const [isCheckingUsername, setIsCheckingUsername] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debouncedUsername = useDebounceCallback(setUsername, 300)
    const { toast } = useToast()
    const router = useRouter()

    // zod implementation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })
    const checkUsernameUnique = async () => {
        if (username) {
            setIsCheckingUsername(true);
            setUsernameMessage('');
            try {
                const response = await axios.get(`/api/check-username-unique?username=${username}`);
                console.log("Response", response);
                setUsernameMessage(response.data.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUsernameMessage(axiosError.response?.data.message || "Error checking username");
            } finally {
                setIsCheckingUsername(false);
            }
        } else {
            setUsernameMessage(''); // Clear message when input is empty or invalid
        }
    };

    useEffect(() => {
        checkUsernameUnique();
    }, [username]);


    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            console.log(data);
            const response = await axios.post<ApiResponse>('/api/sign-up', data)
            toast({
                title: 'Success',
                description: response.data.message
            })
            router.replace(`/verify/${username}`)
        } catch (error) {
            console.error("Error in signup of user", error)
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500">
            <div className="w-full max-w-lg p-10 space-y-10 bg-white rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-4">
                        Welcome to whisper-net
                    </h1>
                    <p className="text-sm text-gray-500 mb-6">
                        Join us and share your anonymous thoughts with friends
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Username</FormLabel>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debouncedUsername(e.target.value);
                                        }}
                                        className="border-2 border-gray-300 p-2 rounded-lg"
                                    />
                                    {isCheckingUsername && <Loader2 className="animate-spin text-purple-500" />}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm mt-1 ${usernameMessage === 'Username is unique'
                                                ? 'text-green-500'
                                                : 'text-red-500'

                                                }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Email</FormLabel>
                                    <Input {...field} name="email" className="border-2 border-gray-300 p-2 rounded-lg" />
                                    <p className="text-xs text-gray-400 mt-1">We will send you a verification code</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <Input
                                        type="password"
                                        {...field}
                                        name="password"
                                        className="border-2 border-gray-300 p-2 rounded-lg"
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-6">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link href="/sign-in" className="text-purple-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );

}

export default SignUpPage
