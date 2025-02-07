<script lang="ts">
  import SiderBar from "$lib/SiderBar.svelte";
  import ChatMain from "$lib/ChatMain.svelte";
  import Topbar from "$lib/Topbar.svelte";
  import UserSettings from "$lib/UserSettings.svelte";
  import UserContexMenu from "$lib/UserContexMenu.svelte";
  import AiModelSelector from "$lib/AIModelSelector.svelte";
  import  Login from "$lib/Login.svelte";
  import { onMount } from "svelte";
  import "../../i18n.js";
  import { clickOutside } from "../../utils/generalUtils.js";
  import {getChatListData,} from "../../manages/chatManages";
  import {showErrorMessage,isNewchat,} from "../../stores/globalParamentStores";
  import {current_chat_id,dataLoaded,} from "../../stores/chatStores.js";



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
  let showSettings = false;
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
  <UserContexMenu on:show-settings={()=>{showSettings = true;}} on:close-card={()=>showUserContexMenu = false} on:reset-password={resetPassword}/>
  {/if}
  {#if showSettings}
    <UserSettings />
  {/if}
{/if}

<style>
  :global(html, body) {
    height: 100%;
  }
</style>
