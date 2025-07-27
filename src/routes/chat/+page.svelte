
<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import type { Message } from "$lib/types"
    import { onMount } from "svelte";
    import { user } from "$lib/stores";
    import { goto } from "$app/navigation";
    
    let messages: Message[] = $state([])
    let new_message: string = $state("");
    let chats_id: number = $state(0);
    let isLoading: boolean = $state(false);
    
    onMount(() => {
        // ユーザーがログインしていない場合、ログインページにリダイレクト
        if (!$user) {
            goto('/auth/login');
            return;
        }
        
    });

    async function requestAI(inputMessage: string) {
        if (!$user?.id) {
            alert('ユーザー情報が取得できません。再度ログインしてください。');
            goto('/auth/login');
            return null;
        }

        const userId = Number($user.id);
        if (isNaN(userId) || userId <= 0) {
            alert('無効なユーザーIDです。再度ログインしてください。');
            goto('/auth/login');
            return null;
        }

        try {
            isLoading = true;
            const response = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    chatsId: chats_id,
                    input: inputMessage,
                    messages: messages
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                // console.error('API Error:', response.status, errorText);
                throw new Error(`API request failed: ${response.status}`);
            }

            const ai_message = await response.json();
            chats_id = ai_message.newChatsId;
            return ai_message;
        } catch (error) {
            // console.error('Request failed:', error);
            alert('エラーが発生しました。もう一度お試しください。');
            return null;
        } finally {
            isLoading = false;
        }
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        
        if (!new_message.trim()) {
            return;
        }

        if (!$user?.id) {
            alert('ユーザー情報が取得できません。再度ログインしてください。');
            goto('/auth/login');
            return;
        }

        const userMessage = new_message;
        messages.push({role: "user", content: userMessage});
        new_message = ""; // すぐにクリア（引数で渡すため）

        const ai_message = await requestAI(userMessage);
        if (ai_message?.message) {
            messages.push({role: "assistant", content: ai_message.message});
        }
    }
</script>

<main class="main-container">
    <Header />
    {#if !$user}
        <div class="loading">ユーザー情報を確認中...</div>
    {:else if messages.length === 0}
        <div class="chat-container">
            <div class="pre-chat">
                <h2>こんにちは！<br>今日はどのようなお手伝いをしましょうか。</h2>
            </div>
            <div class="chat-box">
                <form class="chat-form" onsubmit={handleSubmit}>
                    <textarea 
                        placeholder="Type your message here..."
                        bind:value={new_message}
                        disabled={isLoading}
                        ></textarea>
                    <button type="submit" disabled={isLoading || !new_message.trim()}>
                        {isLoading ? '送信中...' : 'Send'}
                    </button>
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
                        disabled={isLoading}
                    ></textarea>
                    <button type="submit" disabled={isLoading || !new_message.trim()}>
                        {isLoading ? '送信中...' : 'Send'}
                    </button>
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

    .loading {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: var(--font-size-base);
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

    button:hover:not(:disabled) {
        opacity: 0.9;
    }

    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    textarea:disabled {
        opacity: 0.6;
    }
</style>