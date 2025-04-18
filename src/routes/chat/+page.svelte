<script lang="ts">
  import {t } from "svelte-i18n";
  import SiderBar from "$lib/SiderBar.svelte";
  import ChatMain from "$lib/ChatMain.svelte";
  import Topbar from "$lib/Topbar.svelte";
  import UserSettings from "$lib/UserSettings.svelte";
  import UserContexMenu from "$lib/UserContexMenu.svelte";
  import AiModelSelector from "$lib/AIModelSelector.svelte";
  import Login from "$lib/Login.svelte";
  import { onMount } from "svelte";
  import "../../i18n.js";
  import { clickOutside } from "../../utils/generalUtils.js";
  import { getChatListData ,getMessagesListData,} from "../../manages/chatManages";
  import {
    showErrorMessage,
    isNewchat,
    isLogin,
    isGuest,
  } from "../../stores/globalParamentStores";
  import { current_chat_id, dataLoaded,chat_list,current_chat } from "../../stores/chatStores.js";
  import { get } from "svelte/store";

  // 状态管理
  let isReady = false;
  let showSelector = false;
  let selectorTop: number;
  let selectorLeft: number;
  let selectorBottom: number;
  let selectorRight: number;
  let callback: Function; // 选择模型的回调函数
  let originElement: HTMLElement;
  let closeCallback: Function;
  let showLogin = false;
  let isResetPassword = false;
  let showUserContexMenu = false;
  let showSettings = false;
  let isInstallPromptVisable = false;//是否显示安装提示
  function changeChat(event: CustomEvent) {}

  onMount(async () => {

    isLogin.subscribe(async (v) => {
      if (!v || !isReady) {return;}

      await initData();
    });
    isGuest.subscribe(async (v) => {
      if (!v || !isReady) return;
      await initData();
    });
    await initData();
    current_chat_id.subscribe(async (value) => {
      localStorage.setItem("current_chat_id", value.toString());
      if (value != 0) {
        if(get(isNewchat)) return;// 因为是在发送消息getMessage里更新状态，所以新对话不用更新消息列表，并且isNewchat会延迟一会更新为false
        let data: any = await getMessagesListData();
        if (data != 0) {
          showErrorMessage(data);
          return;
        }
      } else {
        current_chat.set([]);
      }
    });

    isNewchat.subscribe(async (v) => {
      if (!v && isReady) {
        
        await getChatListData();//当前对话从新对话变为非新对话时，需要更新聊天列表
      }
    });

    let show_pwa_install = localStorage.getItem("showPWAinstall") || "true";
    if(typeof window !== "undefined" && window.self_promp){
      isInstallPromptVisable = show_pwa_install=="true";
    }else{
      isInstallPromptVisable = false;
    }

    dataLoaded.set(true);
    isReady = true;
  });

  async function initData() {
    let res = await getChatListData();
    if (res != 0) {
      showErrorMessage(res);
      return;
    }
    let chatid = Number(localStorage.getItem("current_chat_id") || 0);
    let index = get(chat_list).findIndex((c) => c.cid == chatid);
    current_chat_id.set(index<0?0:chatid);
    if (chatid == 0) {
      isNewchat.set(true);
    }
  }

  function showModelSelector(event: CustomEvent) {
    if (event.detail.originElement) originElement = event.detail.originElement; // 点击的元素
    if (event.detail.closeCallback) closeCallback = event.detail.closeCallback; // 关闭的回调函数
    selectorTop = event.detail.position.top;
    selectorLeft = event.detail.position.left;
    selectorBottom = event.detail.position.bottom;
    selectorRight = event.detail.position.right;
    callback = event.detail.callback;
    showSelector = !showSelector;
  }

  function hideSelector() {
    if (closeCallback) closeCallback();
    showSelector = false;
  }

  function aiModelSelected(event: CustomEvent) {
    hideSelector();
    callback(event.detail.ai, event.detail.model);
  }

  function resetPassword() {
    isResetPassword = true;
    showLogin = true;
  }
  function pwainstall(){
    window.self_promp.prompt();
    window.self_promp.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        localStorage.setItem("showPWAinstall", 'false');
        isInstallPromptVisable = false; 
      }
    })
  }
  function close_pwainstall(){
    isInstallPromptVisable = false;
    localStorage.setItem("showPWAinstall", "false");
  }
</script>

<svelte:head>
  <title>{$t('app.title')}</title>
  <meta name="description" content={$t('app.description')} />
  <meta name="keywords" content={$t('app.keywords')} />
  <meta property="og:title" content={$t('app.title')} />
  <meta property="og:description" content={$t('app.description')} />
  <meta property="og:type" content="website" />
</svelte:head>

{#if isReady}
  <div class="relative flex h-full overflow-hidden">
    <!-- 侧边栏 -->
    <SiderBar
      on:selectChat={changeChat}
      on:showLoginBox={() => (showLogin = true)}
      on:show-user-menu={() => (showUserContexMenu = true)}
    />
    <!-- 聊天主界面 -->
    <div class="flex-1 relative">
      <Topbar on:show-selector={showModelSelector} />
      <ChatMain
        on:show-user-menu={() => (showUserContexMenu = true)}
        on:show-selector={showModelSelector}
        on:showLoginBox={() => (showLogin = true)}
      />
    </div>
    <!-- AI选择器需要JS计算位置，主要是左上角坐标。元件宽度260px，高度310px，注意边缘计算 -->
    {#if showSelector}
      <div
        use:clickOutside={{
          callback: hideSelector,
          originElement: originElement,
        }}
      >
        <AiModelSelector
          on:aiModelSelected={aiModelSelected}
          top={selectorTop}
          left={selectorLeft}
          bottom={selectorBottom}
          right={selectorRight}
        />
      </div>
    {/if}
  </div>
  {#if showLogin}
    <Login
      on:close-card={() => (showLogin = false)}
      isPage={false}
      {isResetPassword}
      on:login-success={() => (showLogin = false)}
    />
  {/if}
  {#if showUserContexMenu}
    <UserContexMenu
      on:show-settings={() => {
        showSettings = true;
      }}
      on:close-card={() => (showUserContexMenu = false)}
      on:reset-password={resetPassword}
    />
  {/if}
  {#if showSettings}
    <UserSettings
      on:close-settings={() => {
        showSettings = false;
      }}
    />
  {/if}
{:else}
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
{/if}

{#if isInstallPromptVisable}
<div
    class="fixed bottom-5 left-5 bg-gray-600 rounded-lg shadow-lg p-3 pr-5 max-w-xs z-50 flex items-center gap-2 sm:max-w-sm animate-in fly-in-from-bottom transition-all duration-300 ease-in-out"
  >
    <img
      src="/favicon.png"
      alt="App Icon"
      class="w-6 h-6"
    />
    <!-- 提示文案 -->
    <p class="text-sm text-white flex-1">{$t("app.installPrompt")}</p>
    <!-- 安装按钮（文字） -->
    <button
    on:click={pwainstall}
      class="bg-themegreen text-white px-3 py-1 rounded text-sm hover:bg-themegreenhover transition cursor-pointer hover:scale-105"
    >
    {$t("app.installAdd")}
    </button>
    <!-- 关闭图标 -->
    <button
    on:click={(close_pwainstall)}
    class="absolute -top-2 -right-2 bg-gray-400 rounded-full p-1 text-white hover:bg-gray-500 transition cursor-pointer"
    aria-label="关闭提示"
  >
    <svg
      class="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</div>
{/if}

<style>
  @import "../../styles/skeleton.css";
  :global(html, body) {
    height: 100%;
  }
</style>
