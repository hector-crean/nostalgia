import axios from 'axios';
import { } from 'openai';
import React, { useState } from 'react';


interface ChatCompletion {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    choices: ChatChoice[];
}

interface FunctionCall {
    arguments: string,
    name: string
}
interface ChatChoice {
    message: {
        role: string;
        content: string;
        content_tokens: string[];
        function_call: FunctionCall
    };
    finish_reason: string;
    index: number;
}



const chatCompletionObject: ChatCompletion = {
    "id": "chatcmpl-123",
    "object": "chat.completion",
    "created": 1677652288,
    "model": "gpt-3.5-turbo-0613",
    "choices": [{
        "index": 0,
        "message": {
            "role": "assistant",
            "content": "\n\nHello there, how may I assist you today?",
        },
        "finish_reason": "stop"
    }],
    "usage": {
        "prompt_tokens": 9,
        "completion_tokens": 12,
        "total_tokens": 21
    }
}




const openAiKey = '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';

// Define a Message type to represent chat messages
interface Message {
    role: 'system' | 'user' | 'assistant'; // Role of the message (system, user, or assistant)
    content: string; // Content of the message
}



const OpenAIChat: React.FC = () => {

    const [messages, setMessages] = useState<Message[]>([]); // State to store chat messages
    const [newMessage, setNewMessage] = useState<string>(''); // State to track the new message being typed
    const [loading, setLoading] = useState<boolean>(false); // State to track loading status

    const apiUrl: string = "https://api.openai.com/v1/chat/completions"; // OpenAI API endpoint

    // Handle input change when the user types a message
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
    };

    // Function to add a new message to the chat
    const addMessage = (content: string, role: 'user' | 'assistant' = 'user') => {
        const newMessages = [...messages];
        newMessages.push({ role, content });
        setMessages(newMessages);
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        if (!newMessage.trim()) return; // Don't send empty messages

        addMessage(newMessage, 'user'); // Add the user's message to the chat
        setNewMessage(''); // Clear the input field
        setLoading(true); // Set loading state while waiting for a response

        try {
            // Send a POST request to the OpenAI API
            const response = await axios.post(
                apiUrl,
                {
                    prompt: messages.map((message) => message.content).join('\n') + '\nUser: ' + newMessage,
                    max_tokens: 50, // Adjust as needed, this determines the length of the response
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${openAiKey}`, // Include the API key in the request headers
                    },
                }
            );

            const assistantResponse = response.data.choices[0].text;

            // Add the assistant's response to the chat
            addMessage(assistantResponse, 'assistant');
            setLoading(false); // Reset loading state

        } catch (error) {
            console.error('Error sending message:', error);
            setLoading(false); // Reset loading state on error
        }
    };

    // Render the chat UI
    return (
        <div>
            {/* Chat messages */}
            <div>
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                        {message.content}
                    </div>
                ))}
            </div>

            {/* Input field for typing a new message */}
            <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type your message..."
            />

            {/* Button to send a message */}
            <button onClick={handleSendMessage} disabled={loading}>
                Send
            </button>
        </div>
    );
};

export { OpenAIChat };
