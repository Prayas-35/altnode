'use client';

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { XCircleIcon, SendIcon } from 'lucide-react';
import { TbMessageChatbot } from "react-icons/tb";
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

const NodeBot: React.FC = () => {
    const [isChatboxOpen, setIsChatboxOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! How can I assist you today?',
            timestamp: new Date().toISOString()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        if (isChatboxOpen) {
            const timer = setTimeout(scrollToBottom, 100);
            return () => clearTimeout(timer);
        }
    }, [isChatboxOpen, messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/v1/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: inputMessage,
                    context: messages.slice(1).map(msg => `${msg.role}: ${msg.content}`).join('\n')
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data,
                timestamp: new Date().toISOString()
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            <div className="fixed bottom-10 right-10">
                <button
                    className="p-3 rounded-full bg-purple-600 text-white shadow-lg size-16"
                    onClick={() => setIsChatboxOpen(!isChatboxOpen)}
                >
                    <TbMessageChatbot className="size-10 font-black" />
                </button>
            </div>

            {isChatboxOpen && (
                <div className="fixed bottom-28 right-10 w-[400px] dark:bg-slate-950 bg-white shadow-lg rounded-lg p-4 z-50">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <TbMessageChatbot className="size-6 text-purple-600" />
                            <h2 className="text-lg font-bold">AI Assistant</h2>
                        </div>
                        <button
                            onClick={() => setIsChatboxOpen(false)}
                            className="text-gray-500 hover:text-gray-800"
                        >
                            <XCircleIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="h-[400px] mb-4 overflow-hidden">
                        <ScrollArea
                            ref={scrollAreaRef}
                            className="h-full p-2 dark:bg-gray-900 bg-gray-100 rounded"
                        >
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-800 dark:text-gray-200'
                                                }`}
                                        >
                                            <ReactMarkdown className="text-sm prose dark:prose-invert max-w-none">
                                                {message.content}
                                            </ReactMarkdown>
                                            <span className="text-xs opacity-70 mt-1 block">
                                                {new Date(message.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-200 dark:bg-gray-800 p-3 rounded-lg">
                                            <p className="text-sm">Thinking...</p>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message..."
                            className="flex-grow"
                            rows={1}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={isLoading || !inputMessage.trim()}
                            className="flex-shrink-0"
                        >
                            <SendIcon className="size-4" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};

export default NodeBot;