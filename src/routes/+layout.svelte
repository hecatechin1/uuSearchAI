<script>
    import { onMount } from "svelte";
    import { waitLocale } from "svelte-i18n";
    import "../i18n.js";

    import { initializeI18n } from "../i18n";

    let isReady = false;
    onMount(async () => {
        await initializeI18n();
        await waitLocale();
        isReady = true;
    });
</script>

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
