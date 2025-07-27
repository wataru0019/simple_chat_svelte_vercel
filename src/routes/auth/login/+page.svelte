<script lang="ts">
    import { goto } from "$app/navigation";
    import { signIn } from "@auth/sveltekit/client";
    let email = $state("")
    let password = $state("")

    async function handleLogin(e: Event){
        e.preventDefault()
        const result = await signIn("credentials", {
            email: email,
            password: password,
            redirect: false
        })

        if(result?.error) {
            console.log("ログイン失敗")
        } else {
            console.log("ログイン成功")
            console.log(result)
            goto("/chat")
        }
    }

</script>

<div class="login">
    <h2>login</h2>
    <div class="form-wrapper">
        <form onsubmit={handleLogin}>
            <div class="form-control">
                <label for="email">Email:</label><br />
                <input type="email" name="email" placeholder="your-email@example.com..." bind:value={email} required />
            </div>
            <div class="form-control">
                <label for="password">Password:</label><br />
                <input type="password" name="password" placeholder="password..." bind:value={password} required />
            </div>
            <div class="form-control submit">
                <button type="submit">ログイン</button>
            </div>
            <div class="goto-signup">
                <a href="/auth/signup">新規登録はこちら</a>
            </div>
        </form>
    </div>
    <hr />
    <div class="social-logion">
        <div class="social">
            <a href="/chat">Google</a>
            <a href="/chat">Facebook</a>
            <a href="/chat">apple</a>
        </div>
    </div>
</div>

<style>
    .login {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        width: 100%;
        padding: var(--space-lg);
        box-sizing: border-box;
    }

    .login h2 {
        font-size: var(--font-size-lg);
        margin-bottom: var(--space-lg);
    }

    .form-wrapper {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }

    form {
        padding: var(--space-lg) 0;
        width: 100%;
    }

    .form-control {
        padding: var(--space-sm) 0;
    }

    .form-control input {
        width: 100%;
        margin-top: var(--space-sm);
        padding: var(--space-md);
        box-sizing: border-box;
        border: 1px solid #ddd;
        border-radius: var(--space-sm);
    }

    .submit {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: var(--space-lg);
    }

    .submit button {
        width: 100%;
        padding: var(--space-md);
        background-color: var(--primary-color);
        border: none;
        border-radius: var(--space-sm);
        color: var(--light-shade);
        cursor: pointer;
        font-size: var(--font-size-base);
    }

    .submit button:hover {
        opacity: 0.9;
    }

    .goto-signup a {
        text-decoration: none;
        color: var(--light-accent-color)
    }

    hr {
        width: 100%;
        max-width: 400px;
        margin: var(--space-lg) 0;
        border: none;
        border-top: 1px solid #ddd;
    }

    .social-logion {
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
    }

    .social-logion .social {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .social-logion .social a {
        width: 100%;
        margin: var(--space-sm) 0;
        padding: var(--space-md);
        background-color: var(--light-shade);
        border: 1px solid var(--primary-color);
        border-radius: var(--space-sm);
        color: var(--primary-color);
        text-align: center;
        text-decoration: none;
        box-sizing: border-box;
        display: block;
        font-size: var(--font-size-base);
        transition: all var(--transition-duration) var(--transition-timing);
    }

    .social-logion .social a:hover {
        background-color: var(--primary-color);
        color: var(--light-shade);
    }

    /* レスポンシブ対応 */
    @media (min-width: 768px) {
        .form-wrapper,
        .social-logion,
        hr {
            max-width: 500px;
        }
    }

    @media (min-width: 1024px) {
        .form-wrapper,
        .social-logion,
        hr {
            max-width: 600px;
        }
    }

    /* モバイル対応 */
    @media (max-width: 480px) {
        .login {
            padding: var(--space-md);
            min-height: 100vh;
            justify-content: flex-start;
            padding-top: 10vh;
        }
        
        .form-wrapper,
        .social-logion,
        hr {
            max-width: 100%;
        }
        
        .login h2 {
            margin-bottom: var(--space-md);
        }
    }
</style>