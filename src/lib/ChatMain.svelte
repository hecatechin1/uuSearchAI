<script lang="ts">
  import { createEventDispatcher, onMount, afterUpdate } from "svelte";
  import TopbarChat from "./TopbarChat.svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import ShareTopbarOverlay from "./ShareTopbarOverlay.svelte"; 
  import ShareImageModal from "./ShareImageModal.svelte"// 导入新组件
  import ShareLinkModal from "./ShareLinkModal.svelte";
  import { t } from "svelte-i18n"; // 导入本地化方法
  import { get, writable } from "svelte/store";
  import SendDisabledIcon from "../assets/sendmessage-default.svg";
  import SendHoverIcon from "../assets/sendmessage-hover.svg";
  import SendIcon from "../assets/sendmessage-active.svg";
  import WaitIcon from "../assets/stop.svg";
  import ShareImageIcon from "../assets/shareImage.svg";
  import ShareLinkIcon from "../assets/shareLink.svg";
  import { sendKey, language, lineBreakKey } from "../stores/settingsStores";
  import {
    current_chat,
    current_chat_ai,
    current_chat_model,
  } from "../stores/chatStores";
  import {
    getMessage,
    closeStream,
    share,
    getShortLink,
  } from "../manages/chatManages";
  import {
    showErrorMessage,
    isStreaming,
    isLogin,
    isGuest,
    isLoading_messagesList,

    isNewchat,
    isShared,
    isSharing,
  } from "../stores/globalParamentStores";
  import { guest_signup } from "../manages/userinfoManages";
    import { ssrModuleExportsKey } from "vite/runtime";
    import { parseHashParams, removeHashParam } from "../utils/generalUtils";
  // export let isSharing; // 分享状态
  let dispatch = createEventDispatcher();
  let isLoading = false;
  let input: string = "";
  let textAreaElement: HTMLTextAreaElement; // 定义文本框元素的引用
  let isMobile = false;
  let container: any;
  let shouldScroll = true;
  let isFocused = false; // 添加输入框聚焦状态变量
  let isNewInputFocused = false; // 添加新聊天输入框聚焦状态变量

  let isShareImageModalOpen = false;
  let isShareLinkModalOpen = false;
  let shareSelectedMessages: any[] = [];
  let shareSelectedMessagesIndex: any[] = [];
  let isAllChecked = false;
  let shareButtonDisabled = true;
  let shareType = ''; //分享类型
  let shareLink = "";
  let showSharingLoading = false;
  const textMaxHeight = 300; // Maximum height in pixels
  const keys = {
    Enter: "001",
    "Shift+Enter": "011",
    "Ctrl+Enter": "101",
  };

  let userInput = "";
  let isSendHovered = false;

  onMount(async () => {
    isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

      if(parseHashParams().q){
        input = parseHashParams().q;

        isNewchat.update(v=>{return true});
        processMessage();
        removeHashParam("q");
      }

  });

  afterUpdate(() => {
    if (shouldScroll && container) {
      container.scrollTop = container.scrollHeight;
    }
  });

  function handleScroll() {
    // 判断用户是否滚动到接近底部
    const threshold = 50; // 像素阈值
    const position = container.scrollTop + container.clientHeight;
    const height = container.scrollHeight;
    shouldScroll = position > height - threshold;
  }

  function autoExpand(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    
    // 1. 保存当前状态
    const isCursorAtEnd = textarea.selectionEnd === textarea.value.length;
    const originalScrollTop = textarea.scrollTop;
    const originalSelectionStart = textarea.selectionStart;
    const originalSelectionEnd = textarea.selectionEnd;

    // 2. 计算新高度
    textarea.style.height = "auto";
    const computed = window.getComputedStyle(textarea);
    const height = 
        parseInt(computed.borderTopWidth) +
        textarea.scrollHeight +
        parseInt(computed.borderBottomWidth);
    const newHeight = Math.min(height, textMaxHeight);
    textarea.style.height = `${newHeight}px`;

    // 3. 恢复滚动位置和光标
    textarea.scrollTop = originalScrollTop;
    textarea.selectionStart = originalSelectionStart;
    textarea.selectionEnd = originalSelectionEnd;

    // 4. 仅当光标在末尾且需要滚动时跳转到底部
    if (newHeight >= textMaxHeight && isCursorAtEnd) {
        textarea.scrollTop = textarea.scrollHeight;
    }
}

  function handleInput(event: any) {
    autoExpand(event); // 扩展 textarea 的高度
  }

  function textAreaKeysListener(event: any) {
    let sendCode = parseInt(keys[get(sendKey)], 2);
    let linebreakCode = parseInt(keys[get(lineBreakKey)], 2);
    let e = parseInt(event.key === "Enter" ? "001" : "000", 2);
    let se = parseInt(event.shiftKey ? "010" : "000", 2);
    let ce = parseInt(event.ctrlKey ? "100" : "000", 2);
    let kd = ce | se | e;
    if (!(sendCode ^ kd) && !isMobile) {
      if (event.isComposing) return;
      event.preventDefault();
      processMessage();
    }

    if (!(linebreakCode ^ kd) || (event.key === "Enter" && isMobile)) {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value =
        textarea.value.substring(0, start) +
        "\n" +
        textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1;
      textarea.dispatchEvent(new Event("input"));
    }
  }

  function getRandomPrompts() {
    const prompts = ($t("promptRefer") as unknown as string[]) || []; // Add double assertion
    return prompts
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }
  function showUserSettings(){
    dispatch("show-user-settings");
  }
  async function processMessage() {
    let msg = input;
    input = "";


    getMessage(msg, get(current_chat_ai), get(current_chat_model));
    textAreaElement.style.height = "1.6rem"; // Reset the height after sending
    textAreaElement.style.lineHeight = "1.2rem";
  }


  function showModelSelector(event: CustomEvent) {
    dispatch("show-selector", event.detail);
  }
  function showShareMenu(event:CustomEvent){
    // dispatch("show-sharemenu", event.detail);
    let i = event.detail.index; // 接收选中的消息
    // isSharing = true; // 打开分享菜单时设置为 true
    isSharing.set(true);
    if(shareSelectedMessages.length>0){
    isAllChecked = false;
      handleSelectAll()
    }
    shareMessagesContorler(i, true);
  }

  function tryOtherModel(event: CustomEvent) {
    dispatch("show-selector", event.detail);
  }
  function showLoginBox(event: CustomEvent) {
    dispatch("showLoginBox", event.detail);
  }
  function showUserMenu() {
    dispatch("show-user-menu");
  }
  function sharingSelectorListener(event: CustomEvent) {
    let i = event.detail.index; // 接收选中的消息
    let checked = event.detail.checked; // 接收选中状态
    let isIncluded = shareSelectedMessages.includes(get(current_chat)[i].mid);
    shareMessagesContorler(i, checked);
  }
  //index:消息下表，checked：选中状态
  function shareMessagesContorler(index:number, checked:boolean){
    let isIncluded = shareSelectedMessages.includes(get(current_chat)[index].mid);
    if(checked && !isIncluded){
      shareSelectedMessages.push(get(current_chat)[index].mid);
      shareSelectedMessages.push(get(current_chat)[index-1].mid);
      current_chat.update((value) => {
        value[index].sharingChecked = true;
        value[index-1].sharingChecked = true; // 更新当前消息的 sharingChecked 属性
        return value; // 返回更新后的消息数组 
      })
      shareSelectedMessagesIndex.push(index);
      shareSelectedMessagesIndex.push(index-1);
    }else if(!checked && isIncluded){
      shareSelectedMessages = shareSelectedMessages.filter((mid) => mid !== get(current_chat)[index].mid);
      shareSelectedMessages = shareSelectedMessages.filter((mid) => mid !== get(current_chat)[index-1].mid);
      current_chat.update((value) => {
        value[index].sharingChecked = false;
        value[index-1].sharingChecked = false; // 更新当前消息的 sharingChecked 属性
        return value; // 返回更新后的消息数组 
      })
      shareSelectedMessagesIndex = shareSelectedMessagesIndex.filter((i) => i!== index);
      shareSelectedMessagesIndex = shareSelectedMessagesIndex.filter((i) => i!== index-1);
    }
    shareSelectedMessagesIndex.sort((a, b) => a - b);
    shareButtonDisabled = shareSelectedMessages.length === 0;
    isAllChecked = shareSelectedMessages.length === get(current_chat).length;
    shareLink = window.location.origin + window.location.pathname + '#share=' + shareSelectedMessages.join(','); // 生成分享链接
  }

  function handleStartSharing() {
    //在这里处理分享状态变更逻辑，更新isSharing变量，并将调用分享的mid一组问答选中（如果是user，选择本条和下一条，如果是assistant，选择本条和上一条）
  }

  function handleSelectAll() {
    let  checked = isAllChecked;
    for(let i = 1; i < get(current_chat).length; i+=2){
      shareMessagesContorler(i, checked);
    }
  }

  async function handleCopyLink() {
    try {
      showSharingLoading = true;
      shareType = 'link';
      await getShareUrl();
    } finally {
      showSharingLoading = false;
      shareType = '';
      isShareLinkModalOpen = true;
    }
  }

  async function handleShareImage() {
    try {
      showSharingLoading = true;
      shareType = 'image';
      await getShareUrl();
    }
    finally {
      showSharingLoading = false;
      shareType = '';
      isShareImageModalOpen = true;
    }
  }

  async function getShareUrl(){
    if (shareLink === "" || shareSelectedMessages.length == 0) {
        showErrorMessage($t("app.error.emptyShare", { default: "Share link is empty or no messages selected." }));
    }
    let shareRes = await share(shareSelectedMessages);
    if (shareRes != 0) {
        showErrorMessage($t("app.error.shareFailed", { default: "Share error occurred." }));
    }
    let shortUrl = await getShortLink(shareLink);
    if (shortUrl == 1) {
        showErrorMessage($t("app.error.shortLinkFailed", { default: "Failed to get short link." }));
    }else{
      shareLink = shortUrl;
    }
  }



</script>

{#if $isLoading_messagesList}
  <div class="main-chat-skeleton">
    <div class="message skeleton mb-5 message-flex-end"></div>
    <div class="message skeleton"></div>
    <div class="message large skeleton"></div>
    <div class="message skeleton"></div>
  </div>
{:else}
  <div
    class="relative h-full w-full flex-1 transition-width overflow-hidden max-w-full flex-col max-md:h-[calc(100%-44px)] chatMain">
    <!-- 渲染 ShareTopbarOverlay -->
    <ShareTopbarOverlay isVisible={$isSharing} on:closeSharing={()=>{isSharing.set( false)}} />
    <div
      class="composer-parent flex h-full flex-col focus-visible:outline-0 bg-white"
    >
      <div class="flex-1 overflow-hidden">
        <div class="h-full">
          <div class="relative h-full">
            <div
              bind:this={container}
              class="h-full w-full overflow-y-auto"
              on:scroll={handleScroll}
            >
              <div class="flex flex-col text-sm pb-[82px]">
                <TopbarChat
                  on:show-selector={showModelSelector}
                  on:showLoginBox={showLoginBox}
                  on:show-user-menu={showUserMenu}
                  on:show-user-settings={showUserSettings}
                />
                {#if $isSharing}
                  <div class="h-4"></div>
                {/if}
                {#if $current_chat.length > 0}
                  {#each $current_chat as message, i}
                    <ChatMessage
                      on:show-selector={tryOtherModel}
                      on:show-sharemenu={showShareMenu}
                      on:sharing-msg-selected={sharingSelectorListener}
                      {message}
                      index={i}
                      isSharing={$isSharing}
                    />
                  {/each}

                  <div class="tailblock h-10 w-full"></div>
                {:else}
                  <div
                    class="flex flex-col justify-center items-center pt-20 m-auto px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5 gap-6 max-w-3xl"
                  >
                    <h1
                      class="relative justify-center text-center text-2xl font-semibold"
                    >
                      {$t("app.startNewChat", {
                        default: "Ask AI anything",
                      })}
                    </h1>
                    <!-- 新聊天的输入框 -->
                    <div
                      class="inputbox-container w-full max-md:max-w-[96%] px-1 flex flex-col justify-center items-center bg-gray-100 transition-all border-2 rounded-md
                      {isNewInputFocused
                        ? 'border-themegreen'
                        : 'border-transparent'}"
                    >
                      <textarea
                        class="input-box bg-transparent w-full p-3 flex-1 border-0 resize-none border-none focus:outline-none text-[1rem]"
                        placeholder={$t("app.textareaPlaceholder", {
                          default: "Type your message...",
                        })}
                        rows="4"
                        style="overflow-y: auto; overflow:visible !important; line-height: 1.2rem;"
                        bind:value={input}
                        on:input={handleInput}
                        on:keydown={textAreaKeysListener}
                        on:focus={() => (isNewInputFocused = true)}
                        on:blur={() => (isNewInputFocused = false)}
                      ></textarea>
                      <div class="btn-set w-full flex justify-end pr-3 pb-2">
                        <button
                          class="cursor-pointer text:themegreen hover:themegreenhover transition-colors"
                          on:click={() => {
                            if ($isStreaming) {
                              closeStream();
                            } else {
                              processMessage();
                            }
                          }}
                          on:mouseover={() => (isSendHovered = true)}
                          on:mouseleave={() => (isSendHovered = false)}
                          on:focus={() => (isSendHovered = true)}
                          on:blur={() => (isSendHovered = false)}
                          disabled={!$isStreaming && !input.trim().length}
                        >
                          {#if $isStreaming}
                            <img
                              src={WaitIcon}
                              alt="wait"
                              class="min-w-[32px] w-[32px]"
                            />
                          {:else if input.trim().length === 0}
                            <img
                              src={SendDisabledIcon}
                              alt="send"
                              class="min-w-[32px] w-[32px]"
                            />
                          {:else}
                            <img
                              src={isSendHovered ? SendHoverIcon : SendIcon}
                              alt="send"
                              class="min-w-[32px] w-[32px]"
                            />
                          {/if}
                        </button>
                      </div>
                    </div>

                    {#if $t("promptRefer")?.length > 0}
                      <div
                        class="max-md:hidden flex flex-wrap justify-center gap-2 w-full max-w-3xl mx-auto"
                      >
                        {#each getRandomPrompts() as prompt}
                          <button
                            on:click={() => (input = prompt)}
                            class="text-left p-2 rounded-md bg-white hover:bg-gray-50 border transition-colors truncate"
                            style="min-width: 200px;"
                          >
                            {prompt}
                          </button>
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天输入框 -->
      {#if $current_chat.length > 0}
        {#if !$isSharing}
        <div
          class="md:pt-0 md:border-transparent md:dark:border-transparent w-full mb-2"
        >
          <div
            class="m-auto text-base px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5"
          >
            <div
              class="mx-auto flex flex-1 gap-2 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] flex-col items-center"
            >

              <div
                class="inputbox-container w-full px-3 flex justify-center items-center bg-gray-100 transition-all {isFocused
                  ? 'border-2 border-themegreen'
                  : 'border-2 border-transparent'}"
              >
                <div
                  class="inputbox w-full flex items-end mt-auto mx-auto py-[0.5rem] relative"
                >
                  <textarea
                    bind:this={textAreaElement}
                    class="bg-transparent min-h-[2.5rem] flex-1 mr-2 border-0 resize-none border-none focus:outline-none"
                    placeholder={$t("app.textareaPlaceholder")}
                    autofocus
                    rows="1"
                    bind:value={input}
                    on:input={handleInput}
                    style="overflow-y: auto; overflow:visible !important; line-height: 1.2rem; min-height: 1.6rem;"
                    on:keydown={textAreaKeysListener}
                    on:focus={() => (isFocused = true)}
                    on:blur={() => (isFocused = false)}
                  ></textarea>
                  <button
                    class="cursor-pointer text:themegreen hover:themegreenhover transition-colors"
                    on:click={() => {
                      if ($isStreaming) {
                        closeStream();
                      } else {
                        processMessage();
                      }
                    }}
                    on:mouseover={() => (isSendHovered = true)}
                    on:mouseleave={() => (isSendHovered = false)}
                    on:focus={() => (isSendHovered = true)}
                    on:blur={() => (isSendHovered = false)}
                    disabled={!$isStreaming && !input.trim().length}
                  >
                    {#if $isStreaming}
                      <img
                        src={WaitIcon}
                        alt="wait"
                        class="min-w-[32px] w-[32px]"
                      />
                    {:else if input.trim().length === 0}
                      <img
                        src={SendDisabledIcon}
                        alt="send"
                        class="min-w-[32px] w-[32px]"
                      />
                    {:else}
                      <img
                        src={isSendHovered ? SendHoverIcon : SendIcon}
                        alt="send"
                        class="min-w-[32px] w-[32px]"
                      />
                    {/if}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {:else}
          <div
            class="md:pt-0 md:border-transparent md:dark:border-transparent w-full mb-2"
          >
            <hr/>
            <div
              class="m-auto text-base px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5"
            >
              <div
                class="mx-auto flex flex-1 gap-2 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] flex-col items-center"
              >
                <div class="share-panel w-full px-3 py-2 rounded-md flex items-center justify-between">
                  <!-- 全选复选框 -->
                  <div class="flex items-center gap-2">
                    <input
                      type="checkbox"
                      class="shrink-0 h-5 w-5 rounded-lg border-gray-300 accent-themegreen cursor-pointer"
                      bind:checked={isAllChecked}
                      on:change={handleSelectAll}
                    />
                    <span class="text-sm">{$t("app.selectAll", { default: "Select All" })}</span>
                  </div>
                  
                  <div class="gap-2 flex flex-row">
                    <!-- 复制链接按钮 -->
                    <button
                      disabled={shareButtonDisabled || showSharingLoading}
                      class="relative bg-themegreen text-white px-4 py-2 sm:px-2 rounded hover:bg-themegreenhover flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      on:click={handleCopyLink}
                    >
                      {#if showSharingLoading && shareType === 'link'}
                        <div class="absolute inset-0 flex items-center justify-center">
                          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      {/if}
                      <img src={ShareLinkIcon} alt="Copy Link" class="w-6 h-6" />
                      <span class="text-sm hidden sm:block">{$t("app.shareLink", { default: "Share by Link" })}</span>
                    </button>
                    
                    <!-- 图片分享按钮 -->
                    <button
                      disabled={shareButtonDisabled || showSharingLoading}
                      class="relative bg-themegreen text-white px-4 py-2 sm:px-2 rounded hover:bg-themegreenhover flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      on:click={handleShareImage}
                    >
                      {#if showSharingLoading && shareType === 'image'}
                        <div class="absolute inset-0 flex items-center justify-center">
                          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      {/if}
                      <img src={ShareImageIcon} alt="Share Image" class="w-6 h-6"/>
                      <span class="text-sm hidden sm:block">{$t("app.shareImage", { default: "Share by Image" })}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}
      {/if}


      {#if isShareImageModalOpen}
      <!-- 模态窗口 -->
      <ShareImageModal
        currentTime={new Date().toLocaleString()}
        on:close={() => (isShareImageModalOpen = false)}
        shareIndexs = {shareSelectedMessagesIndex}
        shareUrl={shareLink}
      />
      {/if}
            <!-- 模态窗口 -->
      <ShareLinkModal
        bind:isOpen={isShareLinkModalOpen}
        on:close={() => (isShareLinkModalOpen = false)}
        shareLink={shareLink}
      />
    </div>
    
  </div>
{/if}

<style>
  @import "../styles/styles.css";
  @import "../styles/skeleton.css";
</style>
