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
        // window.addEventListener("load",()=>{
        //     navigator.serviceWorker.register("/service-worker.js",{scope:'/chat'}).then((registration) => {
        //         console.log('Service Worker 注册成功:', registration.scope);       
        //     }).catch(error => {
        //             console.error('Service Worker 注册失败:', error);
        //         });
        // });
        // 在客户端加载时注册 Service Worker

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
<link rel="manifest" href="/manifest.json?v=v1.0.2">
<meta name="theme-color" content="#e5e7eb">
<link rel="icon" href="/favicon.ico" type="image/x-icon">
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
