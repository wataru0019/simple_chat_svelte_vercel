<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import type { Message } from "$lib/types"
    import { onMount } from "svelte";
    import { user } from "$lib/stores";
    let messages: Message[] = $state([])
    let new_message: string = $state("");
    let chats_id: number = $state(0);
    onMount(() => {
        // messages = [
        //     { role: "user", content: "hi!"},
        //     { role: "assistant", content: "hi! wataru!" }
        // ]
    })
    async function requestAI() {
        const response = await fetch("/api/ai", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: Number($user?.id),
                chatsId: chats_id,
                input: new_message,
                messages: messages
            })
        })
        const ai_message = await response.json()
        return ai_message
    }

    async function handleSubmit(e: Event) {
        e.preventDefault()
        messages.push({role: "user", content: new_message})
        const ai_message = await requestAI()
        messages.push({role: "assistant", content: ai_message?.message})
        new_message = ""
    }
</script>

<main class="main-container">
    <Header />
    {#if messages.length === 0}
        <div class="chat-container">
            <div class="pre-chat">
                <h2>こんにちは！<br>今日はどのようなお手伝いをしましょうか。</h2>
            </div>
            <div class="chat-box">
                <form class="chat-form" onsubmit={handleSubmit}>
                    <textarea 
                        placeholder="Type your message here..."
                        bind:value={new_message}
                        ></textarea>
                    <button type="submit">Send</button>
                </form>
                <div class="tool-box">
                    
                </div>
            </div>
        </div>
    {:else}
        <div class="chat-container-view">
            <div class="chat-view-wrapper">
                <div class="chat-view">
                    {#each messages as message}
                        <div class="{message.role} message">
                            <p>{message.content}</p>
                        </div>
                    {/each}
                </div>
            </div>
            <div class="chat-box-bottom">
                <form class="chat-form" onsubmit={handleSubmit}>
                    <textarea
                        placeholder="Type your message here..." 
                        bind:value={new_message}
                    ></textarea>
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    {/if}
</main>

<style>
    .main-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .chat-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    .chat-container-view {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .pre-chat {
        padding: var(--space-xl)
    }

    .pre-chat h2 {
        font-size: var(--font-size-base);
        text-align: center;
    }

    .chat-box {
        width: 100%;
        padding: var(--space-xl);
    }

    .chat-view-wrapper {
        flex: 1;
        overflow-y: auto;
        width: 100%;
    }

    .chat-view {
        padding: var(--space-xl)
    }

    .chat-view .message {
        color: red;
    }

    .chat-view .user {
        color: var(--light-shade);
        background-color: var(--primary-color);
        border-radius: var(--space-sm);
    }

    .chat-view .user p {
        padding: var(--space-sm);
        margin: var(--space-sm);
    }

    .chat-view .assistant {
        color: var(--primary-color);
        background-color: var(--light-shade);
        border-radius: var(--space-sm);
        white-space: pre-wrap;
    }

    .chat-view .assistant p {
        padding: var(--space-sm);
        margin: var(--space-sm);
    }

    .chat-box-bottom {
        width: 100%;
        padding: var(--space-sm);
        flex-shrink: 0;
        border-top: 1px solid #eee;
        background-color: white;
    }

    .chat-form {
        display: flex;
        flex-direction: row;
        gap: var(--space-sm);
        justify-content: center;
    }

    .chat-box textarea,
    .chat-box-bottom textarea {
        width: 60%;
        padding: var(--space-sm);
        font-size: var(--font-size-base);
        border-color: var(--primary-color);
        border-radius: var(--space-sm);
        border-width: 0.5px;
        resize: vertical;
        min-height: 40px;
        max-height: 120px;
    }

    button {
        color: var(--light-shade);
        background-color: var(--primary-color);
        border: none;
        border-radius: var(--space-sm);
        padding: var(--space-sm) var(--space-md);
        cursor: pointer;
        align-self: flex-end;
    }

    button:hover {
        opacity: 0.9;
    }
</style>