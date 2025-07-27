import { supabase } from "./supabase"
import bcrypt from "bcryptjs"
import type { User, Chats, Message } from "./supabase"

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashPassword: string): Promise<boolean>{
    return await bcrypt.compare(password, hashPassword)
}

export async function createUser(
        email: string,
        password: string
    ): Promise<User | null> {
    try {
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()

        if (existingUser) {
            return null
        }

        const hashedPassword = await hashPassword(password)

        const { data: user, error } = await supabase
            .from('users')
            .insert({
                email,
                password: hashedPassword
            })
            .select()
            .single()

        if (error) throw error
        return user
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function findUserByEmail(email: string): Promise<User | null> {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single()
        
        if (error) throw error
        return user
    } catch (error) {
        console.error('Error finding user by email:', error)
        return null
    }
}

export async function updateUser(
    id: number,
    data: { email: string, name: string, avatar: string}
): Promise<User | null> {
    try {
        const { data: updatedUser, error } = await supabase
            .from('users')
            .update(data)
            .eq('id', id)
            .select()
            .single()
        
        if (error) throw error
        return updatedUser
    } catch(error) {
        console.error("ユーザー更新エラー：" + error)
        return null
    }
}

export async function createChats(
    userId: number
): Promise<Chats | null> {
    try {
        const { data: chats, error } = await supabase
            .from('chats')
            .insert({ user_id: userId })
            .select()
            .single()
        
        if (error) throw error
        return chats
    } catch(error) {
        console.error("チャット作成エラー：")
        console.error(error)
        return null
    }
}

export async function getChats(
    userId: number
) {
    try {
        const { data: chat, error } = await supabase
            .from('chats')
            .select('*')
            .eq('user_id', userId)
        
        if (error) throw error
        return chat
    } catch(error) {
        console.error("チャット取得エラー：" + error)
        return null
    }
}

export async function getMessages(
    chatsId: number,
    userId: number
) {
    try {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chats_id', chatsId)
            .eq('user_id', userId)
        
        if (error) throw error
        return messages
    } catch(error) {
        console.error("メッセージ取得エラー" + error)
        return null
    }
}

export async function createMessage(
    userId: number,
    chatsId: number,
    role: string,
    content: string
): Promise<Message | null> {
    try {
        const { data: message, error } = await supabase
            .from('messages')
            .insert({
                user_id: userId,
                chats_id: chatsId,
                role,
                content
            })
            .select()
            .single()
        
        if (error) throw error
        return message
    } catch (error) {
        console.error("メッセージ作成エラー：" + error)
        return null
    }
}