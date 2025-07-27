import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
    const session = await event.locals.auth()

    if (!session?.user) {
        throw redirect(303, "/auth/login")
    }

    return {
        user: session.user
    }
}