<script lang="ts">
    import { signOut } from "@auth/sveltekit/client"
    import { logo } from "$lib/stores"

    async function handleLogout(e: Event) {
        e.preventDefault()
        signOut()
    }
</script>

<header>
    <div class="header-logo">
        <a href="/">
            <h2 class="logo">
                {$logo}
            </h2>
        </a>
    </div>
    <div class="header-menu">
        <div class="header-buttons">
            <a href="/user">User</a>
            <a href="/chatlist">Chat</a>
            <button onclick={handleLogout}>ログアウト</button>
        </div>
    </div>
</header>

<style>
    header {
        max-height: 80px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .header-logo {
        padding: var(--space-md);
        font-size: var(--font-size-lg);
    }

    .header-logo a {
        text-decoration: none;
        font-size: var(--font-size-sm);
        color: var(--dark-shade-color)
    }

    .header-menu {
        padding: var(--space-md);
    }

    .header-buttons a {
        margin-right: var(--space-sm);
        text-decoration: none;
        color: var(--dark-shade-color)
    }

    .header-buttons button {
        padding: var(--space-sm);
        border: 1px solid var(--primary-color);
        border-radius: var(--space-sm);
        background-color: var(--light-shade);
    }
</style>