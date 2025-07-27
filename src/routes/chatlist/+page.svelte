<script lang="ts">
    import Header from '$lib/components/Header.svelte';

    let { data } = $props()
</script>

<div>
    <Header />
    <div class="chat-list-wrapper">
        {#each data.chatlist as chat}
            <div class="chat-link">
                <a href={"/chat/"+ chat?.id + "/chatview"}>
                    <p>チャットID：{chat?.id}</p>
                </a>
            </div>
        {/each}
    </div>
</div>

<style>
    .chat-list-wrapper {
        padding: var(--space-lg);
    }
    
    .chat-link {
        margin: var(--space-md) 0;
        padding-left: var(--space-sm);
        background-color: var(--light-shade);
        border: 1px solid var(--light-accent-color);
        border-radius: var(--space-sm);
    }

    .chat-link a {
        padding: var(--space-md);
        text-decoration: none;
        color: var(--dark-shade-color)
    }
</style>