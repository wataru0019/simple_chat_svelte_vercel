import { SvelteKitAuth } from "@auth/sveltekit";
import Credentials from "@auth/core/providers/credentials";
import type { Provider } from "@auth/core/providers";
import { env } from "$env/dynamic/private"
import { findUserByEmail, verifyPassword } from "$lib/database";

const providers: Provider[] = [
    Credentials({
        id: 'credentials',
        name: 'Email and Password',
        credentials: {
        email: { 
            label: 'Email', 
            type: 'email',
            placeholder: 'your-email@example.com'
        },
        password: { 
            label: 'Password', 
            type: 'password',
            placeholder: 'Your password'
        }
        },
        async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
                return null
            }

            try{
                const user = await findUserByEmail(credentials.email as string)
                if (!user || !user.password) {
                    return null
                }

                const isValid = await verifyPassword(
                    credentials.password as string, 
                    user.password
                )

                if (!isValid) {
                    return null
                }

                return {
                id: user.id.toString(), // Int型の場合は.toString()を追加
                email: user.email,
                name: user.name,
                image: user.avatar
                }
            } catch (error) {
                console.error('Authentication error:', error)
                return null
            }
        }
    }
)
]

export const { handle, signIn, signOut } = SvelteKitAuth({
  // アダプターは使用しない（JWTモードのため）
  providers,
  session: {
    strategy: 'jwt', // JWTモード
    maxAge: 7 * 24 * 60 * 60, // 7日間
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7日間
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
        token.email = user.email
        token.name = user.name
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: env.AUTH_SECRET,
  trustHost: true
})