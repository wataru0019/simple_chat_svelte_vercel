import { getChats } from '$lib/database.js'

export async function load ({ params, locals }) {
    const session = await locals.getSession()
    const chatlist = await getChats(Number(session?.user?.id))
    return {
        chatlist: chatlist
    }
}