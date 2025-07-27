import { readable } from "svelte/store"
import { writable } from "svelte/store"

export const logo = readable("SimpleChat")

export interface AuthUser {
    id: string,
    email: string,
    name?: string,
    avator?: string
}

export const user = writable<AuthUser | null>(null)
export const userLoaded = writable(false)