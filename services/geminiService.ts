
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from '../types';

// Initialize with the correct Google Generative AI package
const genAI = new GoogleGenerativeAI(process.env.API_KEY || '');

// Function to clean markdown formatting from AI responses
const cleanMarkdownFormatting = (text: string): string => {
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown (**text**)
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown (*text*)
        .replace(/#{1,6}\s*(.*?)$/gm, '$1') // Remove headers (# ## ### etc.)
        .replace(/^\s*[-*+]\s+/gm, '• ') // Convert markdown bullets to bullet points
        .replace(/^\s*\d+\.\s+/gm, (match, offset, string) => {
            const lineStart = string.lastIndexOf('\n', offset) + 1;
            const lineText = string.substring(lineStart, offset);
            const indent = lineText.match(/^\s*/)?.[0] || '';
            return indent + (match.match(/\d+/)?.[0] || '1') + '. ';
        }) // Keep numbered lists but clean formatting
        .replace(/\n{3,}/g, '\n\n') // Reduce multiple line breaks
        .trim();
};

export const analyzeSymptomPattern = async (patternDescription: string): Promise<string> => {
    const prompt = `
        You are a helpful assistant for ASHA (Accredited Social Health Activist) workers in rural India. 
        Your goal is to provide simple, clear, and actionable advice based on reported health patterns. 
        Do not provide a medical diagnosis. Focus on preventative measures, when to escalate to a doctor, and what to observe.
        Use simple language, suitable for someone with basic medical training.
        
        Analyze the following situation and provide recommendations:
        
        Situation: "${patternDescription}"
        
        Provide your response as a short, easy-to-read summary with bullet points for actions.
        Do NOT use markdown formatting like asterisks (*), hashtags (#), or other special characters.
        Use plain text only with simple formatting.
        
        Structure your response with these sections:
        1. Potential Risks: (e.g., "This could indicate the start of a waterborne illness.")
        2. Immediate Actions for ASHA worker: (e.g., "Advise families to boil drinking water.", "Check for other cases with similar symptoms nearby.")
        3. When to Escalate: (e.g., "If more than 5 families show symptoms, or if anyone develops high fever or breathing difficulty, contact the Primary Health Centre immediately.")
    `;

    if (!process.env.API_KEY) {
        console.error('Gemini API key not found');
        return 'API configuration error. Please check your API key setup.';
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return cleanMarkdownFormatting(text);
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            return `Analysis failed: ${error.message}. Please try again.`;
        }
        return "An error occurred while analyzing the pattern. Please check your connection and try again.";
    }
};

export const getChatbotResponse = async (history: ChatMessage[], newQuery: string): Promise<string> => {
    const systemInstruction = `You are "ASHA Helper", a friendly and knowledgeable AI assistant for ASHA (Accredited Social Health Activist) workers in rural India.
    Your purpose is to provide quick, accurate, and simple information related to common health issues, first aid, nutrition, maternal care, and child health.
    - Keep your answers concise and easy to understand. Use simple language.
    - Use simple bullet points or numbered lists for steps or recommendations.
    - DO NOT use markdown formatting like asterisks (*), hashtags (#), or other special characters. Use plain text only.
    - DO NOT provide medical diagnoses. Instead, guide the ASHA worker on symptoms to watch for and when to escalate to a doctor or the Primary Health Centre (PHC).
    - You can answer questions about:
        - Common symptoms (fever, cough, diarrhea).
        - First aid for minor injuries (cuts, burns).
        - Nutrition advice for children and pregnant women.
        - Vaccination schedules.
        - Recognizing danger signs in newborns or pregnant women.
    - Be supportive and encouraging.`;

    if (!process.env.API_KEY) {
        console.error('Gemini API key not found');
        return 'API configuration error. Please check your setup.';
    }

    try {
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction
        });
        
        // Filter history to ensure it starts with a user message
        // Remove any leading model messages that could cause the API error
        let filteredHistory = history.slice();
        while (filteredHistory.length > 0 && filteredHistory[0].role === 'model') {
            filteredHistory.shift();
        }
        
        // If history is empty or starts with user message, proceed normally
        const chat = model.startChat({
            history: filteredHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }))
        });
        
        const result = await chat.sendMessage(newQuery);
        const response = await result.response;
        return cleanMarkdownFormatting(response.text());
    } catch (error) {
        console.error("Error calling Gemini API for chatbot:", error);
        if (error instanceof Error) {
            return `Sorry, I encountered an error: ${error.message}. Please try again.`;
        }
        return "Sorry, I am having trouble connecting. Please check your internet and try again.";
    }
};
