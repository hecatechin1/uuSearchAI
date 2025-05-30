<script>
  import { onMount } from "svelte";
  import { waitLocale } from "svelte-i18n";
  import browserSignature from "browser-signature";
  import "../../app.css";
  import "../../i18n.js";
  import {
    showError,
    showSuccess,
    message,
    browser_signature,
    TokenLimit,
    isShared,
    isNewchat,
  } from "../../stores/globalParamentStores";
  import {
    getUserInfo,
    userLoginForMaxthon,
  } from "../../manages/userinfoManages";
  // import { fly } from "svelte/transition";
  import { getCookieValue,parseHashParams,removeHashParam } from "../../utils/generalUtils";
  import { getLimit } from "../../manages/planManages";
  import { getShare } from "../../manages/chatManages";

  let loading = true;

  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let urlParameter = urlParams.get("mxcallback");
    const signature = browserSignature();
    browser_signature.set(signature);
    if (getCookieValue("MXTOKEN") != null || urlParameter != null) {
      await userLoginForMaxthon();
    }
    await getUserInfo();
    let limit = localStorage.getItem("limit") || "";
    if (limit) {
      TokenLimit.set(limit);
    } else {
      getLimit().then((res) => {
        if (res !== 1) {
          TokenLimit.set(JSON.stringify(res.result));
          localStorage.setItem("limit", JSON.stringify(res.result));
        }
      });
    }
    if(parseHashParams().q){
      loading = false; // 设置为已加载
      return;
    }
    await isShareState();
    isShared.subscribe((v) => {
      if (!v) {
        // 创建当前 URL 的副本
        const url = new URL(window.location.href);
        // 移除 hash 部分
        removeHashParam("share");
        // 更新 URL 而不刷新页面
        window.history.pushState({}, document.title, url);
      }
    });

    loading = false; // 设置为已加载
  });

  //判断是否是分享状态
  async function isShareState() {
    // const hash = window.location.hash.substring(1);
    // if (hash == "") {
    //   return;
    // }
    // let urlHash = new URLSearchParams(hash);
    // let hashParams = Object.fromEntries(urlHash.entries());
    let hashParams = parseHashParams();
    if (!hashParams.share) {
      return;
    }
    const shareMessages = hashParams.share
      .split(",")
      .map((item) => item.trim())
      .map((item) => Number(item))
      .filter(Boolean);
    if (shareMessages.length == 0) {
      return;
    }
    await getShare(shareMessages);
  }


</script>

<!-- {#if $showError}
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
{/if} -->

<!-- 改成默认类型吧，比如showDefault，我先用一下error试试，另外，通知显示的时长太短，加长一点，3s吧 -->
<!-- {#if $showError}
  <div transition:fly="{{ y: 20, duration: 500 }}" class="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-gray-100 px-4 py-3 rounded-lg shadow-md" role="alert">
      <span class="block sm:inline">{$message}</span>
    </div>
  {/if} -->

{#if loading}
  <div class="flex h-screen">
    <!-- Sidebar Skeleton -->
    <aside
      class="sidebar-skeleton z-[21] flex shrink-0 overflow-x-hidden max-md:!w-0 w-64 flex-col h-full bg-grey-700"
    >
      <div class="header skeleton"></div>
      <div class="chat-item skeleton"></div>
      <div class="chat-item skeleton"></div>
      <div class="chat-item skeleton"></div>
      <div class="chat-item skeleton"></div>
      <!-- <div class="message-loader"></div> -->
    </aside>

    <!-- Main Chat Skeleton -->
    <div class="main-chat-skeleton">
      <div class="message skeleton mb-5 message-flex-end"></div>
      <div class="message skeleton"></div>
      <div class="message large skeleton"></div>
      <div class="message skeleton"></div>
    </div>
  </div>
{:else}
  <slot />
{/if}

<style>
  @import "../../styles/skeleton.css";
  :global(html, body) {
    height: 100%;
  }
</style>
