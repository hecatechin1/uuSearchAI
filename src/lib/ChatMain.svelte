<script lang="ts">
  import { createEventDispatcher, onMount, afterUpdate } from "svelte";
  import TopbarChat from "./TopbarChat.svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import { t } from "svelte-i18n"; // 导入本地化方法
  import { get, writable } from "svelte/store";
  import SendDisabledIcon from "../assets/sendmessage-default.svg";
  import SendHoverIcon from "../assets/sendmessage-hover.svg";
  import SendIcon from "../assets/sendmessage-active.svg";
  import WaitIcon from "../assets/stop.svg";
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
    console.log(get(current_chat).length)
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

  function autoExpand(event: any) {
    event.target.style.height = "inherit"; // 重置高度
    const computed = window.getComputedStyle(event.target);
    const height =
      parseInt(computed.getPropertyValue("border-top-width"), 10) +
      event.target.scrollHeight +
      parseInt(computed.getPropertyValue("border-bottom-width"), 10);
    const newHeight = Math.min(height, textMaxHeight);
    event.target.style.height = `${newHeight}px`; // 设置计算后的高度

    // 手动调整滚动位置，确保新内容可见
    if (newHeight >= textMaxHeight) {
      event.target.scrollTop = event.target.scrollHeight;
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

  function tryOtherModel(event: CustomEvent) {
    dispatch("show-selector", event.detail);
  }
  function showLoginBox(event: CustomEvent) {
    dispatch("showLoginBox", event.detail);
  }
  function showUserMenu() {
    dispatch("show-user-menu");
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
    class="relative h-full w-full flex-1 transition-width overflow-hidden max-w-full flex-col max-md:h-[calc(100%-44px)]"
  >
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
                />

                {#if $current_chat.length > 0}
                  {#each $current_chat as message, i}
                    <ChatMessage
                      on:show-selector={tryOtherModel}
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
      {/if}
    </div>
  </div>
{/if}

<style>
  @import "../styles/styles.css";
  @import "../styles/skeleton.css";
</style>
