import { getChats, getMessages } from '$lib/database.js'

export async function load ({ params, locals }) {
    try {
        const session = await locals.auth()
        console.log('Loading messages for:', {
            chatId: params.chatid,
            userId: session?.user?.id
        })
        
        if (!session?.user?.id) {
            console.log('No user session found')
            return {
                messages: [],
                chatId: params.chatid
            }
        }
        
        const messages = await getMessages(Number(params.chatid), Number(session.user.id))
        console.log('Retrieved messages:', messages)
        
        return {
            messages: messages || [],
            chatId: params.chatid
        }
    } catch (error) {
        console.error('Error loading messages:', error)
        return {
            messages: [],
            chatId: params.chatid
        }
    }
}