import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import AuthProvider from '../context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'True Feedback',
    description: 'Real feedback from real people.',
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className="bg-gray-50">
            <AuthProvider>
                <body className={`${inter.className} flex flex-col min-h-screen`}>
                    <header className="bg-gray-900 text-white p-4">
                        <h1 className="text-2xl font-bold">True Feedback</h1>
                        <p className="text-sm">Share your thoughts anonymously.</p>
                    </header>
                    <main className="flex-grow">
                        {children}
                    </main>
                    <footer className="bg-gray-900 text-white text-center p-4">
                        <p>&copy; {new Date().getFullYear()} True Feedback. All rights reserved.</p>
                    </footer>
                    <Toaster />
                </body>
            </AuthProvider>
        </html>
    );
}
