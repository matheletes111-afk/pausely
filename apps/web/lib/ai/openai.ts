import OpenAI from 'openai';
import { SYSTEM_PROMPT } from './prompts';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[],
  impulseType: string
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'system',
      content: `The user is working on managing their impulse related to: ${impulseType}.`,
    },
    ...conversationHistory,
    { role: 'user', content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: messages as any,
    max_tokens: 150,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || "I'm here to support you through this moment.";
}

export async function generateSessionSummary(
  conversationHistory: ChatMessage[]
): Promise<string> {
  const conversation = conversationHistory
    .filter((msg) => msg.role !== 'system')
    .map((msg) => `${msg.role === 'user' ? 'User' : 'Coach'}: ${msg.content}`)
    .join('\n');

  const summaryPrompt = `Summarize this coaching session in 2-3 sentences. Focus on what the user was struggling with, key insights discussed, and offer words of encouragement. Keep it brief and supportive.

Conversation:
${conversation}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: summaryPrompt },
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: messages as any,
    max_tokens: 200,
    temperature: 0.7,
  });

  return response.choices[0]?.message?.content || 'Session completed.';
}

