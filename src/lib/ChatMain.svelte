<script lang="ts">
  import { createEventDispatcher, onMount, afterUpdate } from "svelte";
  import TopbarChat from "./TopbarChat.svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import ShareTopbarOverlay from "./ShareTopbarOverlay.svelte"; // 导入新组件
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
  } from "../manages/chatManages";
  import {
    showErrorMessage,
    isStreaming,
    isLogin,
    isGuest,
    isLoading_messagesList
  } from "../stores/globalParamentStores";
  import { guest_signup } from "../manages/userinfoManages";
    import { ssrModuleExportsKey } from "vite/runtime";

  let dispatch = createEventDispatcher();
  let isLoading = false;
  let input: string = "";
  let textAreaElement: HTMLTextAreaElement; // 定义文本框元素的引用
  let isMobile = false;
  let container: any;
  let shouldScroll = true;
  let isFocused = false; // 添加输入框聚焦状态变量
  let isNewInputFocused = false; // 添加新聊天输入框聚焦状态变量
  let isSharing = true; // 添加分享状态变量;

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
    dispatch("show-sharemenu", event.detail);
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

  $: messages = $current_chat;

  function handleStartSharing() {
    //在这里处理分享状态变更逻辑，更新isSharing变量，并将调用分享的mid一组问答选中（如果是user，选择本条和下一条，如果是assistant，选择本条和上一条）
  }

  function handleSelectAll() {
    //在这里处理全选逻辑，将会话的所有mid全部选中或全部取消选中。
  }

  function handleShare() {
    //在这里处理分享逻辑，将选中的mid一组问答分享出去
  }

  function handleCopyLink() {
    //在这里处理复制链接逻辑，将分享的落地链接复制到剪切板、提示用户，并变更isSharing状态    
  }

  function handleShareImage() {
    //在这里处理截图逻辑，将选中的mid一组问答截图，提示用户，并变更isSharing状态。
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
    <ShareTopbarOverlay isVisible={isSharing} />
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
                {#if isSharing}
                  <div class="h-4"></div>
                {/if}
                {#if $current_chat.length > 0}
                  {#each $current_chat as message, i}
                    <ChatMessage
                      on:show-selector={tryOtherModel}
                      on:show-sharemenu={showShareMenu}
                      {message}
                      index={i}
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
        {#if !isSharing}
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
                    class="shrink-0 h-5 w-5 rounded-lg border-gray-300 accent-themegreen"
                    on:change={handleSelectAll}
                  />
                  <span class="text-sm">{$t("app.selectAll", { default: "Sellect All" })}</span>
                </div>
                
                <div class="gap-2 flex flex-row">
                   <!-- 复制链接按钮 -->
                  <button
                    class="bg-themegreen text-white px-2 py-1 rounded hover:bg-themegreenhover flex items-center gap-1"
                    on:click={handleCopyLink}
                  >
                  <img src={ShareLinkIcon} alt="Copy Link" class="w-4 h-4" />
                    <span class="text-sm hidden sm:block">{$t("app.shareLink", { default: "Share by Link" })}</span>
                  </button>
                <!-- 图片分享按钮 -->
                <button
                  class="bg-themegreen text-white px-2 py-1 rounded hover:bg-themegreenhover flex items-center gap-1"
                  on:click={handleShareImage}
                >
                  <img src={ShareImageIcon} alt="Share Image" class="w-4 h-4"/>
                  <span class="text-sm hidden sm:block">{$t("app.shareImage", { default: "Share by Image" })}</span>
                </button>

                </div>
              </div>
            </div>
          </div>
        </div>
        {/if}
      {/if}
    </div>
  </div>
{/if}

<style>
  @import "../styles/styles.css";
  @import "../styles/skeleton.css";
</style>
