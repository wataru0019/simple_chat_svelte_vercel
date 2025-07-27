import { getChats, getMessages } from '$lib/database.js'

export async function load ({ params, locals }) {
    const session = await locals.getSession()
    const messages = await getMessages(Number(params.chatid), Number(session?.user?.id))
    return {
        messages: messages,
        chatId: params.chatid
    }
}