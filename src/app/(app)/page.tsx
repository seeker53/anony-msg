'use client';

import { Button } from '@/components/ui/button';
import { Mail, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
export default function Home() {
  const [totalMessages, setTotalMessages] = useState(0);
  const [userCount, setTotalUserCount] = useState(0);
  useEffect(() => {
    // Fetch the total message count from your API
    const fetchTotalMessages = async () => {
      try {
        const response = await fetch('/api/count-messages'); // Adjust the API endpoint accordingly
        const data = await response.json();
        setTotalMessages(data.totalMessages);
      } catch (error) {
        console.error('Error fetching message count:', error);
      }
    };
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/count-users');
        const data = await response.json();
        setTotalUserCount(data.userCount);
      } catch (error) {
        console.error('Error fetching user count:', error)
      }
    }

    fetchTotalMessages();
    fetchUserCount();
  }, []);

  return (
    <div className="flex flex-col flex-grow bg-gray-800 text-white">
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Whisper your thoughts, connect anonymously.
          </h1>

          {/* Message Count */}
          <p className="mt-4 text-xl md:text-2xl font-semibold">
            Over <span className="text-blue-400">{totalMessages}</span> messages sent anonymously till now!
          </p>
          <p className="mt-4 text-xl md:text-2xl font-semibold">
            Over <span className="text-blue-400">{userCount}</span> user registered!!!
          </p>

          <Link href="/sign-up">
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
              Get Started
            </Button>
          </Link>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-gray-100 shadow-lg">
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-gray-700">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-900 text-white">
        © 2024 Whisper Net. All rights reserved.
      </footer>
    </div>
  );
}
