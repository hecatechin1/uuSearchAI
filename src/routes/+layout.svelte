<script>
  import "../app.css";
  import "../i18n.js";
  import { initializeI18n } from "../i18n";
  import { onMount } from "svelte";
  import { waitLocale } from "svelte-i18n";
  import{showError,showSuccess,message} from "../stores/globalParamentStores"
  let loading = true;

  showError.subscribe((value)=>{
    if (value) {
      setTimeout(() => {
        showError.set(false);
        message.set("");
      }, 1000);
    }
  });
  showSuccess.subscribe((value)=>{
    if (value) {
      setTimeout(() => {
        showSuccess.set(false);
        message.set("");
      }, 1000);
    }
  });

  onMount(async () => {
    await initializeI18n();
    await waitLocale();
    loading = false; // 设置为已加载
  });
</script>

{#if $showError}
<div>
  <h1 style="color:red">{$message}</h1>
</div>
{/if}

{#if $showSuccess}
<div>
  <h1 style="color:green">{$message}</h1>
</div>
{/if}



{#if loading}
  <div></div>
{:else}
  <slot />
{/if}
