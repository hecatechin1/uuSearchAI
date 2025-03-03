<script>
  import "../app.css";
  import "../i18n.js";
  import { initializeI18n } from "../i18n";
  import { onMount } from "svelte";
  import { waitLocale } from "svelte-i18n";
  import{showError,showSuccess,message,browser_signature} from "../stores/globalParamentStores"
  import {getUserInfo,userLoginForMaxthon} from '../manages/userinfoManages';
  import { userID } from "../stores/userStores";
  import { fly } from 'svelte/transition';
  import {getCookieValue} from '../utils/generalUtils'
  import browserSignature from 'browser-signature';
  let loading = true;
 
  showError.subscribe((value)=>{
    if (value) {
      setTimeout(() => {
        showError.set(false);
        message.set("");
      }, 5000);
    }
  });
  showSuccess.subscribe((value)=>{
    if (value) {
      setTimeout(() => {
        showSuccess.set(false);
        message.set("");
      }, 5000);
    }
  });

  onMount(async () => {
    const signature = browserSignature();
    browser_signature.set(signature);
    // userID.set("1733973830");
    if(getCookieValue('MXTOKEN') != null){
      await userLoginForMaxthon();
    }
    await getUserInfo();
    

    await initializeI18n();
    await waitLocale();
    loading = false; // 设置为已加载
  });
</script>

{#if $showError}
  <div transition:fly="{{ y: 20, duration: 500 }}" class="z-50 fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-md transition" role="alert" style="z-index: 2000">
    <span class="block sm:inline">{$message}</span>
  </div>
{/if}

{#if $showSuccess}
<div transition:fly="{{ y: 20, duration: 500 }}" class="z-50 fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md" role="alert" style="z-index: 2000">
    <span class="block sm:inline">{$message}</span>
  </div>
{/if}

<!-- 改成默认类型吧，比如showDefault，我先用一下error试试，另外，通知显示的时长太短，加长一点，3s吧 -->
<!-- {#if $showError}
<div transition:fly="{{ y: 20, duration: 500 }}" class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-gray-100 px-4 py-3 rounded-lg shadow-md" role="alert">
    <span class="block sm:inline">{$message}</span>
  </div>
{/if} -->


{#if loading}
  <div></div>
{:else}
  <slot />
{/if}
