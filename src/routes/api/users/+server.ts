import { supabase } from "$lib/supabase";
import { json } from '@sveltejs/kit';
import { createUser, updateUser } from "$lib/database"

export async function GET() {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', 1)
            .single()
        
        if (error) throw error
        return json(users)
    } catch (error) {
        console.log(error)
        const err = { message: "ユーザーが見つかりません" }
        return json(err)
    }
}

export async function POST({ request }) {
    const { email, password } = await request.json();

    const user = await createUser(email, password)

    return json(user)
}

export async function PATCH({ request }) {
    const { id, email, name, avatar } = await request.json()

    if(!id) {
        return json({ message: "IDがありません"}, { status: 400 })
    }
    const data = {
        email,
        name,
        avatar
    }
    try {
        const user = await updateUser(Number(id), data)

        if(!user) {
            return json({ message: "ユーザーが見つからないか、更新に失敗しました" }, { status: 404 })
        }
        return json(user)
    } catch(error) {
        console.error("ユーザー更新エラー：" + error);
        return json({ message: "ユーザー更新中にエラーが発生しました" }, { status: 500 })
    }
}