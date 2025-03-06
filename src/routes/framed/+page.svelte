<script lang="ts">
    import { onMount } from "svelte";
    import ChatMain from "$lib/ChatMain.svelte";
    import UserSettings from "$lib/UserSettings.svelte";

let isReady = false

onMount(async () => {
    isReady = true
});

</script>

<main class="bg-primary overflow-hidden fixed w-full">
    <!-- svelte-ignore empty-block -->
    {#if !isReady}
        <div class="main-chat-skeleton">
            <div class="message skeleton mb-5 message-flex-end"></div>
            <div class="message skeleton"></div>
            <div class="message large skeleton"></div>
            <div class="message skeleton"></div>
        </div>
    {:else if isReady}
        <div class="flex h-screen relative">
            <ChatMain isFramed />
        </div>
    {/if}
</main>

<style>
    @import "../../styles/skeleton.css";
</style>
  