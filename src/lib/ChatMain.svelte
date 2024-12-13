<script lang="ts">
  // import ChatMessage from "./ChatMessage.svelte";
  import { createEventDispatcher, onMount } from "svelte";
  import TopbarChat from "./TopbarChat.svelte";
  import ChatMessage from "./ChatMessage.svelte";
  import { t } from "svelte-i18n"; // 导入本地化方法
  import { get, writable } from "svelte/store";
  import DeleteIcon from "../assets/delete.svg";
  import SendDisabledIcon from "../assets/send-disable.svg";
  import SendIcon from "../assets/send.svg";
  import WaitIcon from "../assets/wait.svg";
  import { closeStream } from "../services/uuAIServices";
  import {
    settingsVisible,
    sendKey,
    lineBreakKey,
    isStreaming,
  } from "../stores/stores";
  import { current_chat, current_chat_id } from "../stores/chatStores";
  import { getMessagesListData } from "../manages/chatManages";
  import { showErrorMessage } from "../stores/globalParamentStores";
  export let selectedChatId: string;
  export let ai = "GPT";
  export let model = "4o-mini";

  let dispatch = createEventDispatcher();
  let isLoading = true;
  let input: string = "";
  let textAreaElement; // 定义文本框元素的引用
  let isMobile = false;
  const textMaxHeight = 300; // Maximum height in pixels
  const keys = {
    Enter: "001",
    "Shift+Enter": "011",
    "Ctrl+Enter": "101",
  };

  let userInput = "";
  let isSendHovered = false;

  //发送聊天消息
  const sendMessage = () => {};

  // 清除当前聊天中所有message
  const clearMessages = () => {};

  // 打开设置弹窗
  const openSettings = () => {};

  // 打开反馈
  const feedback = () => {};

  onMount(async () => {
    current_chat_id.subscribe(async (value) => {
      if(value == 0) return;
      isLoading = true;
      let data: any = await getMessagesListData();
      if (data != 0) {
        showErrorMessage(data);
        return;
      }
      isLoading = false;
    });
    current_chat_id.set(1733978585512);
  });

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
    // console.log(event.isComposing);
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
      const textarea = this;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      textarea.value =
        textarea.value.substring(0, start) +
        "\n" +
        textarea.value.substring(end);

      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
  }

  function processMessage() {}

  function showModelSelector(event: CustomEvent) {
    dispatch("show-selector", event.detail);
  }
</script>

{#if isLoading}
  <h1>加载中</h1>
{:else}
  <div
    class="relative h-full w-full flex-1 overflow-auto transition-width overflow-hidden"
  >
    <TopbarChat on:show-selector={showModelSelector} />
    <div
      class="composer-parent flex h-full flex-col focus-visible:outline-0 bg-gray-50"
    >
      <div class="flex-1 overflow-hidden"><p>{selectedChatId}</p></div>
      {#if $current_chat.length > 0}
        <div class="flex grow max-w-full px-2">
          <div class="w-full">
            {#each $current_chat as message, i}
              <ChatMessage message ={message.message} index={i} />
            {/each}
            <div class="tailblock h-10 w-full"></div>
          </div>
        </div>
      {:else}
        <div class="flex justify-center items-center h-full">
          <p>
            {$t("app.noConversation", {
              default: "No coversation now, you can ask AI anything.",
            })}
          </p>
        </div>
      {/if}

      <div
        class="md:pt-0 md:border-transparent md:dark:border-transparent w-full mb-2"
      >
        <div
          class="m-auto text-base px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5"
        >
          <div
            class="mx-auto flex flex-1 gap-2 text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] flex-col items-center"
          >
            <div class="inputbox-tools w-full px-2 flex mt-1">
              <!-- 清除当前聊天中所有message，仅在framed页面中显示 -->
              <button
                on:click={clearMessages}
                class="py-1 px-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center mr-2"
              >
                <img
                  class="delete-icon w-4 h-4 text-blue-500 mr-1"
                  alt={$t("app.delete")}
                  src={DeleteIcon}
                />
                <span
                  >{$t("topbar.clearConversation", { default: "Clear" })}</span
                >
              </button>

              <button
                on:click={feedback}
                class="py-1 px-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center mr-2"
              >
                <svg
                  class="w-5 h-5 text-blue-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v2a1 1 0 102 0V6zm0 4a1 1 0 10-2 0v4a1 1 0 102 0v-4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span>{$t("app.feedback")}</span>
              </button>
              <button
                on:click={openSettings}
                class="py-1 px-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg
                  class="w-4 h-4 text-blue-500 mr-1"
                  fill="currentColor"
                  viewBox="0 0 14 14"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <!-- 设置图标 -->
                  <path
                    id="路径_3870"
                    data-name="路径 3870"
                    d="M77.5,705.5H70.938a2,2,0,0,0-3.875,0H64.5a.5.5,0,0,0,0,1h2.563a2,2,0,0,0,3.875,0H77.5a.5.5,0,0,0,0-1ZM69,707.016A1.016,1.016,0,1,1,70.016,706,1.016,1.016,0,0,1,69,707.016Z"
                    transform="translate(-64 -694)"
                    fill="#4a928c"
                  />
                  <path
                    id="路径_3871"
                    data-name="路径 3871"
                    d="M77.5,385.5H74.938a2,2,0,0,0-3.875,0H64.5a.5.5,0,1,0,0,1h6.563a2,2,0,0,0,3.875,0H77.5a.5.5,0,0,0,0-1ZM73,387.016A1.016,1.016,0,1,1,74.016,386,1.016,1.016,0,0,1,73,387.016Z"
                    transform="translate(-64 -379)"
                    fill="#4a928c"
                  />
                  <path
                    id="路径_3872"
                    data-name="路径 3872"
                    d="M64.5,66.5h2.563a2,2,0,0,0,3.875,0H77.5a.5.5,0,0,0,0-1H70.938a2,2,0,0,0-3.875,0H64.5a.5.5,0,0,0,0,1ZM69,64.984A1.016,1.016,0,1,1,67.984,66,1.016,1.016,0,0,1,69,64.984Z"
                    transform="translate(-64 -64)"
                    fill="#4a928c"
                  />
                </svg>
                <span>{$t("topbar.setting", { default: "Settings" })}</span>
              </button>
            </div>
            <div
              class="inputbox-container w-full px-3 flex justify-center items-center bg-[#f4f4f4]"
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
                  style="overflow-y: auto; overflow:visible !important; line-height: 1.2rem; min-height: 1.5rem;"
                  on:keydown={textAreaKeysListener}
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
    </div>
  </div>
{/if}

<style>
  @import "../styles/styles.css";
</style>
