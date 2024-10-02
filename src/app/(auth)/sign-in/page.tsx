'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true); // Start the loader
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password,
        callbackUrl: '/dashboard',
      });
      console.log("result of signin : ", result);
      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: result.error,
            variant: 'destructive',
          });
        }
      }
      if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Error in signing in", error);
      toast({
        title: "Signin failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false); // Stop the loader
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500">
      <div className="w-full max-w-lg p-10 space-y-10 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-4">
            Welcome!
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Join us and share your anonymous thoughts with friends
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email/Username</FormLabel>
                  <Input {...field} className="border-2 border-gray-300 p-2 rounded-lg" />
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
                'Sign In'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
