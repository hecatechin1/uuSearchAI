<script>
    import { onMount } from "svelte";
    import { waitLocale } from "svelte-i18n";
    import "../i18n.js";
    import { t } from "svelte-i18n";
    import {
        showError,
        showSuccess,
        message,
    } from "../stores/globalParamentStores";
    import { initializeI18n } from "../i18n";
    import { fly } from "svelte/transition";
    let isReady = false;

    onMount(async () => {
        await initializeI18n();
        await waitLocale();
        isReady = true;
    });
    showError.subscribe((value) => {
        if (value) {
            setTimeout(() => {
                showError.set(false);
                message.set("");
            }, 5000);
        }
    });
    showSuccess.subscribe((value) => {
        if (value) {
            setTimeout(() => {
                showSuccess.set(false);
                message.set("");
            }, 5000);
        }
    });
</script>
<svelte:head>
  <script>
    // 在 DOM 加载时立即监听
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      window.self_promp = e;
    });
  </script>
</svelte:head>

{#if $showError}
    <div
        transition:fly={{ y: 20, duration: 500 }}
        class="z-50 fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md transition"
        role="alert"
        style="z-index: 2000"
    >
        <span class="block sm:inline">{$message}</span>
    </div>
{/if}

{#if $showSuccess}
    <div
        transition:fly={{ y: 20, duration: 500 }}
        class="z-50 fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md"
        role="alert"
        style="z-index: 2000"
    >
        <span class="block sm:inline">{$message}</span>
    </div>
{/if}
{#if isReady}
    <slot />
{/if}

<style>
    @import "../styles/styles.css";
    @import "../styles/skeleton.css";
    :global(html, body) {
        height: 100%;
    }
</style>
