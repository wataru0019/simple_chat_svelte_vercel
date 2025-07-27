import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export interface User {
    id: number
    email: string
    name?: string
    avatar?: string
    password?: string
    created_at: string
    updated_at: string
}

export interface Chats {
    id: number
    user_id: number
    created_at: string
    updated_at: string
}

export interface Message {
    id: number
    role: string
    content: string
    user_id: number
    chats_id: number
    created_at: string
    updated_at: string
}

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY)