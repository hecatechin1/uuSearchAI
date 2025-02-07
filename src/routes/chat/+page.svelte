<script lang="ts">
  import SiderBar from "$lib/SiderBar.svelte";

  import ChatMain from "$lib/ChatMain.svelte";
  import Topbar from "$lib/Topbar.svelte";
  import SearchChat from "$lib/SearchChat.svelte";
  import { onMount } from "svelte";
  import "../../i18n.js";
  import { initializeI18n } from "../../i18n";
  import { waitLocale } from "svelte-i18n";
  import AiModelSelector from "$lib/AIModelSelector.svelte";
  import  Login from "$lib/Login.svelte";
  import { clickOutside } from "../../utils/generalUtils.js";
  import {
    closeStream,
    getChatListData,
    createNewChat,
  } from "../../manages/chatManages";
  import {
    showErrorMessage,
    showSuccessMessage,
    isNewchat,
    isLogin,
  } from "../../stores/globalParamentStores";
  import {
    chat_list,
    current_chat_id,
    dataLoaded,
  } from "../../stores/chatStores.js";
    import UserContexMenu from "$lib/UserContexMenu.svelte";

  // 状态管理
  let selectedChatId = "1";
  let isReady = false;
  let showSelector = false;
  let selectorTop: number;
  let selectorLeft: number;
  let selectorBottom: number;
  let selectorRight : number;
  let callback: Function; // 选择模型的回调函数
  let showLogin = false;
  let isResetPassword = false;
  let showUserContexMenu = false;
  function changeChat(event: CustomEvent) {}

  onMount(async () => {
    // await initializeI18n();
    // await waitLocale();

    let res = await getChatListData();
    if (res != 0) {
      showErrorMessage(res);
      return;
    }
    let chatid = Number(localStorage.getItem("current_chat_id") || 0);
    current_chat_id.set(chatid);
    if (chatid == 0) {
      isNewchat.set(true);
    }
    dataLoaded.set(true);

    isReady = true;
    // isLogin.set(true);
  });

  function showModelSelector(event: CustomEvent) {
    selectorTop = event.detail.position.top;
    selectorLeft = event.detail.position.left;
    selectorBottom = event.detail.position.bottom;
    selectorRight = event.detail.position.right;
    callback = event.detail.callback;
    showSelector = !showSelector;
  }

  function hideSelector() {
    showSelector = false;
  }

  function aiModelSelected(event: CustomEvent) {
    hideSelector();
    callback(event.detail.ai, event.detail.model);
  }

  function resetPassword(){
    isResetPassword = true;
    showLogin = true;
  }

</script>

{#if isReady}
  <div class="relative flex h-full overflow-hidden">
    <!-- 侧边栏 -->
    <SiderBar on:selectChat={changeChat} on:showLoginBox={()=>showLogin = true} on:show-user-menu={()=>showUserContexMenu = true} />
    <!-- 聊天主界面 -->
    <div class="flex-1 relative">
      <Topbar on:show-selector={showModelSelector} />
      <ChatMain {selectedChatId} on:show-user-menu={()=>showUserContexMenu = true} on:show-selector={showModelSelector} on:showLoginBox={()=>showLogin = true}/>
    </div>
    <!-- AI选择器需要JS计算位置，主要是左上角坐标。元件宽度260px，高度310px，注意边缘计算 -->
    {#if showSelector}
      <div use:clickOutside={hideSelector}>
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
      on:close-card={()=>showLogin = false}
      isPage={false}
      isResetPassword={isResetPassword}
      on:login-success={()=>showLogin=false}
      />
  {/if}
  {#if showUserContexMenu}
  <UserContexMenu on:close-card={()=>showUserContexMenu = false} on:reset-password={resetPassword}/>
  {/if}
{/if}

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
