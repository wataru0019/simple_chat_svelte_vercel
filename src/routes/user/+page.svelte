<script lang="ts">
    import Header from "$lib/components/Header.svelte";
    import { user, userLoaded } from "$lib/stores";
    import { onMount } from "svelte";
    let editable = $state(false);
    let editName: string = $state("");
    let editEmail: string = $state("");
    let updateName = $state("")
    let updateEmail = $state("")

    $effect(() => {
        if ($userLoaded && $user) {
            editName = $user.name ?? "";
            editEmail = $user.email ?? "";
        }
    })

    async function toggleEdit() {
        editable = !editable
    }

    async function updateUser(e: Event) {
        e.preventDefault()
        try {
            const response = await fetch("/api/users", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: $user?.id,
                    name: editName,
                    email: editEmail,
                    avator: $user?.avator
                })
            })
            toggleEdit()
            const new_user = await response.json()
            updateName = new_user?.name
            updateEmail = new_user?.email
        } catch(error) {
            console.error("ユーザー更新リクエストエラー：" + error)
        }
    }
</script>

<div>
    <Header />
    <div class="user-view-wrapper">
        <div class="user-view">
            <div class="user-avator">
            {#if $user?.avator}
                <img src={$user?.avator} alt="user's avator" />
            {/if}
                <div class="non-avator"></div>
            </div>
            <div class="user-info">
                {#if editable}
                    <form>
                        <div class="form-control">
                            <label for="name">お名前：</label>
                            <input 
                                type="text" 
                                name="name" 
                                placeholder="お名前を入力してください。"
                                bind:value={editName} />
                        </div>
                        <div class="form-control">
                            <label for="email">メール：</label>
                            <input 
                                type="mail" 
                                name="email" 
                                placeholder="メールを入力してください。"
                                bind:value={editEmail} />
                        </div>
                    </form>
                {:else}
                    <ul>
                        {#if updateName != ""}
                            <li>お名前：{ updateName }</li>
                        {:else}
                            <li>お名前：{ $user?.name }</li>
                        {/if}
                        {#if updateEmail != ""}
                            <li>お名前：{ updateEmail }</li>
                        {:else}
                            <li>お名前：{ $user?.email }</li>
                        {/if}
                    </ul>
                {/if}
            </div>
            <div class="edit-toggle">
                {#if editable}
                    <button onclick={toggleEdit} class="btn destroy">破棄する</button>
                    <button onclick={updateUser} class="btn primary">保存する</button>
                {:else}
                    <button onclick={toggleEdit} class="btn primary">編集する</button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .user-view-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .user-view {
        padding: var(--space-lg)
    }

    .user-avator {
        display: flex;
        justify-content: center;
    }

    .non-avator {
        height: 60px;
        width: 60px;
        margin: var(--space-md);
        border-radius: 50%;
        background-color: var(--light-accent-color);
    }

    .user-info {
        padding: var(--space-md);
    }

    .user-info ul {
        padding: var(--space-md);
    }

    .user-info ul li {
        padding: var(--space-md) 0;
        font-size: var(--font-size-lg);
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

    .edit-toggle {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .edit-toggle .btn {
        padding: var(--space-sm);
        border: none;
        border-radius: var(--space-sm);
    }

    .edit-toggle .destroy {
        margin-right: var(--space-sm);
        color: var(--light-shade);
        background-color: var(--dark-accent-color);
    }

    .edit-toggle .primary {
        color: var(--light-shade);
        background-color: var(--primary-color);
    }
</style>