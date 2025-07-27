import { GoogleGenAI } from "@google/genai";
import { json, error } from '@sveltejs/kit';
import { GOOGLE_GEMINI_API_KEY } from "$env/static/private";
import { createChats, createMessage } from "$lib/database.js";

const ai = new GoogleGenAI({ apiKey: GOOGLE_GEMINI_API_KEY });

async function invokeGemini(input: string, messages: []){
    const message_json = JSON.stringify({messages})
    const prompt = `
    以下の会話履歴を記憶し、ユーザーからのインプットに回答せよ。

    ユーザーインプット： ${input}
    会話履歴： ${message_json}
    `
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite-preview-06-17",
        contents: prompt
    })
    return response.text
}

export async function POST({ request, locals }) {
    try {
        // セッションからユーザー情報を取得
        const session = await locals.auth();
        
        if (!session?.user?.email) {
            throw error(401, 'Unauthorized: No valid session');
        }

        const { userId, chatsId, input, messages } = await request.json();
        
        // userIdの検証とログ出力
        // console.log('API Request Data:', {
        //     userId,
        //     chatsId,
        //     sessionUserEmail: session.user.email,
        //     inputLength: input?.length
        // });

        // userIdが無効な場合、エラーを返す
        if (!userId || userId === null || userId === undefined || isNaN(Number(userId))) {
            // console.error('Invalid userId received:', userId);
            throw error(400, 'Invalid userId provided');
        }

        const validUserId = Number(userId);
        const resAI = await invokeGemini(input, messages);
        let newChatsId: number = 0;

        if (chatsId === 0) {
            // console.log("Creating new chat for userId:", validUserId);
            const newChats = await createChats(validUserId);
            
            // console.log("newChats returned:", newChats);
            
            if (!newChats || !newChats.id) {
                console.error('Failed to create new chat or chat has no ID:', newChats);
                throw error(500, 'Failed to create new chat');
            }
            
            newChatsId = newChats.id;
            // console.log("Created new chat with ID:", newChatsId);
            
            if (resAI) {
                const newUserMessage = await createMessage(validUserId, newChats.id, "user", input);
                const newAiMessage = await createMessage(validUserId, newChats.id, "assistant", resAI);
                // console.log("Created messages:", { newUserMessage, newAiMessage });
            }
        } else {
            // console.log("Using existing chatsId:", chatsId);
            newChatsId = chatsId;
            if (resAI) {
                const newUserMessage = await createMessage(validUserId, chatsId, "user", input);
                const newAiMessage = await createMessage(validUserId, chatsId, "assistant", resAI);
                // console.log("Added messages to existing chat:", { newUserMessage, newAiMessage });
            }
        }

        return json({ message: resAI, newChatsId: newChatsId });
        
    } catch (err) {
        // console.error('AI API Error:', err);
        throw error(500, 'Internal server error');
    }
}