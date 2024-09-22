'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gradient-to-r from-purple-600 to-blue-500 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">
                    True Feedback
                </Link>
                <div className="flex items-center space-x-4">
                    {session ? (
                        <>
                            <span className="text-lg">
                                Welcome, {user?.username || user?.email || 'Guest'}
                            </span>
                            <Button
                                onClick={() => signOut()}
                                className="bg-white text-purple-600 hover:bg-gray-200 transition-colors"
                                variant='outline'
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="bg-white text-purple-600 hover:bg-gray-200 transition-colors">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
