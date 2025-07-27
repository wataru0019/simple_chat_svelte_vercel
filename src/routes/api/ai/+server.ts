import { GoogleGenAI } from "@google/genai";
import { json } from '@sveltejs/kit';
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

export async function POST({ request }) {
    const { userId, chatsId, input, messages } = await request.json();
    const resAI = await invokeGemini(input, messages)
    if ( chatsId === 0 ) {
        console.log("ChatsId:" + chatsId)
       const newChats = await createChats(userId)
       console.log("newChats" + newChats)
       const newUserMessage = await createMessage(userId, newChats?.id, "user", input)
       const newAiMessage = await createMessage(userId, newChats?.id, "assistant", resAI)
    } else {
        console.log("ChatsId:" + chatsId)
        const newUserMessage = await createMessage(userId, chatsId, "user", input)
        const newAiMessage = await createMessage(userId, chatsId, "assistant", resAI)
    }
    return json({ message: resAI })
}