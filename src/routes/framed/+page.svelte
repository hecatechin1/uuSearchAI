<script lang="ts">
  import {
    init,
    getLocaleFromNavigator,
    waitLocale,
    locale,
    number,
  } from "svelte-i18n";
  import type { CustomMessage } from "../../stores/stores";
  import { get, writable } from "svelte/store";
  import { onMount, onDestroy } from "svelte";
  import { initApp, cleanupApp } from "../../appInit";
  import Topbar from "../../lib/Topbar.svelte";
  import Settings from "../../lib/Settings.svelte";
  import SvelteMarkdown from "svelte-markdown";
  import CodeRenderer from "../../renderers/Code.svelte";
  import LinkRenderer from "../../renderers/LinkRenderer.svelte";
  import Devideline from "../../renderers/Devideline.svelte";
  import UserCodeRenderer from "../../renderers/userCode.svelte";
  import EmRenderer from "../../renderers/Em.svelte";
  import ListRenderer from "../../renderers/ListRenderer.svelte";
  import ListItemRenderer from "../../renderers/ListItem.svelte";
  import CodeSpanRenderer from "../../renderers/CodeSpan.svelte";
  import ParagraphRenderer from "../../renderers/Paragraph.svelte";
  import hljs from "highlight.js";
  import { marked } from "marked";
  import "highlight.js/styles/dark.css";
  import "../../i18n.js";
  import {initializeI18n} from "../../i18n";
  import { t } from "svelte-i18n";
  import HtmlRenderer from "../../renderers/Html.svelte";
  import DeleteIcon from "../../assets/delete.svg";
  import CopyIcon from "../../assets/copy.svg";
  import RetryIcon from "../../assets/retry.svg";
  import UserIcon from "../../assets/UserIcon.svg";
  import RobotIcon from "../../assets/aianswer-avtar.svg";
  import MoreIcon from "../../assets/moreactions.svg";
  import EditIcon from "../../assets/edit.svg";
  import SendIcon from "../../assets/sendmessage-active.svg";
  import SendDisabledIcon from "../../assets/sendmessage-default.svg";
  import SendHoverIcon from "../../assets/sendmessage-hover.svg";
  import WaitIcon from "../../assets/stop.svg";
  import GPTIcon from "../../assets/gpt.svg";
  import ClaudeIcon from "../../assets/claude.svg";
  import GeminiIcon from "../../assets/gemini.svg";
  import LikeIcon from "../../assets/helpful.svg";
  import DislikeIcon from "../../assets/unhelpful.svg";
  import LikeActiveIcon from "../../assets/helpful-checked.svg";
  import DislikeActiveIcon from "../../assets/unhelpful-checked.svg";
  import { afterUpdate } from "svelte";
  import {
    settingsVisible,
    messages,
    sendKey,
    lineBreakKey,
  } from "../../stores/stores";
  import {
    isAudioMessage,
    formatMessageForMarkdown,
  } from "../../utils/generalUtils";

  import { copyTextToClipboard } from "../../utils/generalUtils";
  import { isStreaming } from "../../stores/stores";
  import { closeStream } from "../../services/uuAIServices";
  import {
    clearChat,
    deleteMessage,
    sendRegularMessage,
    sendRetryMessage,
  } from "../../manages/messageManages";
  import { parse } from "svelte/compiler";
  // 自定义 renderers
  const renderers = {
    code: CodeRenderer,
    em: EmRenderer,
    list: ListRenderer,
    listitem: ListItemRenderer,
    paragraph: ParagraphRenderer,
    html: HtmlRenderer,
    link:LinkRenderer
    // hr:Devideline,
  };

  const userRenderers = {
    code: UserCodeRenderer,
    codespan: CodeSpanRenderer,
    em: EmRenderer,
    list: ListRenderer,
    listitem: ListItemRenderer,
    paragraph: ParagraphRenderer,
    html: HtmlRenderer,
    // 其他自定义的 renderer
  };

  marked.setOptions({
    highlight: function (code, lang) {
      if (hljs.getLanguage(lang)) {
        return hljs.highlight(lang, code).value;
      }
      return hljs.highlightAuto(code).value;
    },
    langPrefix: "hljs language-", // 为高亮添加类前缀，确保样式生效
  });

  let isSendHovered = false;
  let urlParameter;
  let input: string = "";
  let textAreaElement: any;
  let editTextArea: any;

  let pdfOutput = "";

  let chatContainer: HTMLElement;
  let moreButtonsToggle: boolean = false;
  let conversationTitle = "";

  let editingMessageId: number | null = null;
  let editingMessageContent: string = "";

  let chatContainerObserver: MutationObserver | null = null;
  let isMobile = false;
  let loading = true;
  let isShowUserFirstQuery = false;
  function setupMutationObserver() {
    if (!chatContainer) return; // Ensure chatContainer is mounted

    const config = { childList: true, subtree: true, characterData: true };

    chatContainerObserver = new MutationObserver((mutationsList, observer) => {
      // Trigger scroll if any relevant mutations observed
      scrollChatToEnd();
    });

    chatContainerObserver.observe(chatContainer, config);
  }

  onMount(async () => {
    await initApp();
    isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );
    // Setup MutationObserver after app initialization and component mounting
    setupMutationObserver();



    window.addEventListener("message", (event) => {
      // console.log(event.data);
      input = event.data;
      processMessage();
    });

    document.addEventListener("DOMContentLoaded", function () {
      // 选择所有的 h1-h6 标签
      const headings = document.querySelectorAll(
        ".message-display h1, .message-display h2, .message-display h3, .message-display h4, .message-display h5, .message-display h6",
      );

      // 遍历每个 heading 元素，设置 data-text 属性并添加4个字符
      headings.forEach((heading) => {
        const originalText = heading.textContent;
        const extendedText = originalText + "..."; // 在文本后添加4个空格
        heading.setAttribute("data-text", extendedText);
      });
    });
    //初始化store中需要保存在localStorage里的值
    let sendk = localStorage.getItem("sendkey") || "Enter";
    let linebreakk = localStorage.getItem("linebreakkey") || "Shift+Enter";


    // let storedMessages = localStorage.getItem("search_messages");
    let storedMessages = null; // 24-9-10 搜索结果-AI搜索页面不再需要历史记录



    let parsedMessages: CustomMessage[] =
      storedMessages !== null ? JSON.parse(storedMessages) : [];
    sendKey.set(sendk);
    sendKey.subscribe((value) => {
      localStorage.setItem("sendkey", value);
    });
    lineBreakKey.set(linebreakk);
    lineBreakKey.subscribe((value) => {
      localStorage.setItem("linebreakkey", value);
    });
    messages.set(parsedMessages);
    messages.subscribe((value) => {
      localStorage.setItem("search_messages", JSON.stringify(value));
    });

    //语言初始化
    // 提前设置初始语言
    await initializeI18n();
    // const initialLocale =localStorage.getItem("locale") || getLocaleFromNavigator().split('-')[0] || "en";
    // // 设置初始语言
    // locale.set(initialLocale);
    await waitLocale();
    loading = false; // 设置为已加载
    const urlParams = new URLSearchParams(window.location.search);
    urlParameter = urlParams.get("aisearch_q");
    if (urlParameter) {
        input = urlParameter;
        processMessage();
      }
  });

  onDestroy(() => {
    // Clean up MutationObserver when component is destroyed to prevent memory leaks
    if (chatContainerObserver) {
      chatContainerObserver.disconnect();
      chatContainerObserver = null;
    }
    // Clean up app-specific resources
    cleanupApp();
  });

  function scrollChatToEnd() {
    if (chatContainer) {
      const threshold = 150; // How close to the bottom (in pixels) to trigger auto-scroll
      const isNearBottom =
        chatContainer.scrollHeight - chatContainer.scrollTop - threshold <=
        chatContainer.clientHeight;

      if (isNearBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }
  const keys = {
    Enter: "001",
    "Shift+Enter": "011",
    "Ctrl+Enter": "101",
  };
  function textAreaKeysListener(event: any) {
    // console.log(event.isComposing);
    let sendCode = parseInt(keys[get(sendKey)], 2);
    let linebreakCode = parseInt(keys[get(lineBreakKey)], 2);
    let e = parseInt(event.key === "Enter" ? "001" : "000", 2);
    let se = parseInt(event.shiftKey ? "010" : "000", 2);
    let ce = parseInt(event.ctrlKey ? "100" : "000", 2);
    let kd = ce | se | e;
    if (!(sendCode ^ kd) && !isMobile) {
      if(event.isComposing) return;
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

  const textMaxHeight = 300; // Maximum height in pixels

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

  function processMessage() {
    sendRegularMessage(input);
    input = "";
    textAreaElement.style.height = "1.5rem"; // Reset the height after sending
    textAreaElement.style.lineHight = "1.2rem";
  }
  function scrollChat() {
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function copyText(content: string, index: number) {
    //copyicon
    copyTextToClipboard(content.replaceAll('\\n','\n'));
    let copyelm = document.getElementsByClassName("copyAnime" + index)[0];

    copyelm.classList.add("small-rotate-animation");
    setTimeout(() => {
      copyelm.classList.remove("small-rotate-animation");
    }, 500);
  }

  let lastMessageCount = 0;
  afterUpdate(() => {
    const currentMessageCount = $messages.length || 0;
    if (currentMessageCount > lastMessageCount) {
      scrollChat();
    }
    lastMessageCount = currentMessageCount; // Update the count after every update
  });

  function startEditMessage(i: number) {
    editingMessageId = i;
    editingMessageContent = get(messages)[i].content;
  }

  function retry(i: number) {
    sendRetryMessage(get(messages)[i - 1].content, i);
  }

  function cancelEdit() {
    editingMessageId = null;
    editingMessageContent = "";
    editTextArea.style.height = "96px"; // Reset the height when editing is canceled
  }

  function submitEdit(i: number) {
    const editedContent = editingMessageContent; // Temporarily store the edited content
    sendRetryMessage(editedContent, i + 1);
    cancelEdit();
  }

  // 点赞和踩的方法  因为history是openai API里的ChatCompletionRequestMessage类型，
  //而ChatCompletionRequestMessage类型不包含isLiked和isDisliked这两个属性,所以直接增加属性会报错；
  //stores里定义customChatCompletionRequestMessage继承ChatCompletionRequestMessage,增加isLiked和isDisliked两个属性
  function toggleLike(msgid: any) {
    let msg = $messages[msgid];
    msg.isLiked = true;
    msg.isDisliked = false;
    let conv = get(messages);
    conv[msgid] = msg;
    messages.set(conv);
  }

  function toggleDislike(msgid: any) {
    let msg = $messages[msgid];
    msg.isLiked = false;
    msg.isDisliked = true;
    let conv = get(messages);
    conv[msgid] = msg;
    messages.set(conv);
  }

  function reloadConfig() {
    // console.log();
  }

  // 显示settings
  function openSettings() {
    settingsVisible.set(true);
  }

  function feedback(){
    window.open('https://forms.gle/9sWKVZTnV8gf9onSA', '_blank');
  }

  function clearMessages(){
    clearChat();
    isShowUserFirstQuery = true;
  }
</script>


<!-- src/routes/[your-page]/+page.svelte -->
<svelte:head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4JCE4T7WCH"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-4JCE4T7WCH');
  </script>
</svelte:head>

<title>
</title>
{#if $settingsVisible}
  <Settings on:settings-changed={reloadConfig} />
{/if}

<main class="bg-primary overflow-hidden fixed w-full">
  {#if loading}
  <div></div>
  {:else}
  <div
    class="h-screen flex justify-stretch flex-col text-black/80 height-manager bg-primary"
  >
    <!-- <Topbar
        bind:conversation_title={conversationTitle}
        on:new-chat={clearChat}
      /> -->
    <div
      class="flex bg-primary overflow-y-auto overflow-x-hidden justify-center grow pb-10"
      bind:this={chatContainer}
    >
      {#if $messages.length > 0}
        <div class="flex grow max-w-full px-2">
          <div class="w-full">
            {#each $messages as message, i}
              {#if message.role === "assistant"}
                <div
                  class="message relative inline-block bg-primary mt-0 flex flex-col transition-all duration-200 ease-in-out"
                >
                  <!-- 系统消息头像 -->
                  <div class="profile-picture flex align-middle">
                    <div>
                      <img
                        src={RobotIcon}
                        alt="Profile"
                        class="w-[1.5rem] h-[1.5rem]"
                      />
                    </div>
                    <div class="relative ml-2 font-bold">
                      {$t("app.assistantname")}
                    </div>
                  </div>

                  <!-- 系统消息正文 -->
                  <div
                    class="message-display mt-2 transition-all duration-200 ease-in-out"
                  >
                    <SvelteMarkdown
                      {renderers}
                      source={formatMessageForMarkdown(
                        message.content.toString(),
                      )}
                    />
                  </div>

                  {#if $isStreaming === false}
                    <div class="toolbelt flex gap-3 empty:hidden -ml-2">
                      <div class="flex justify-start rounded-xl items-center">
                        <button
                          class="btn-custom copyButton"
                          data-tooltip={$t("app.copy")}
                          on:click={() => copyText(message.content, i)}
                        >
                          <img
                            alt={$t("app.copy")}
                            src={CopyIcon}
                            class={"copy-icon copyAnime" + i}
                          />
                        </button>
                        <button
                          class="btn-custom"
                          data-tooltip={$t("app.retry")}
                          on:click={() => retry(i)}
                        >
                          <img class="" alt={$t("app.retry")} src={RetryIcon} />
                        </button>
                        <button
                          class="deleteButton btn-custom"
                          data-tooltip={$t("app.delete")}
                          on:click={() => deleteMessage(i)}
                        >
                          <img
                            class="delete-icon"
                            alt={$t("app.delete")}
                            src={DeleteIcon}
                          />
                        </button>

                        <button
                          id="likeBtn"
                          class="btn-custom"
                          data-tooltip={$t("app.like")}
                          on:click={() => toggleLike(i)}
                        >
                          <img
                            alt="like"
                            src={message.isLiked ? LikeActiveIcon : LikeIcon}
                            class={message.isLiked
                              ? "small-rotate-animation"
                              : ""}
                          />
                        </button>
                        <button
                          id="dislikeBtn"
                          class="btn-custom"
                          data-tooltip={$t("app.dislike")}
                          on:click={() => toggleDislike(i)}
                        >
                          <img
                            alt="dislike"
                            src={message.isDisliked
                              ? DislikeActiveIcon
                              : DislikeIcon}
                            class={message.isDisliked
                              ? "small-rotate-animation"
                              : ""}
                          />
                        </button>
                      </div>
                    </div>
                  {/if}
                </div>
              {:else if message.role === "user"}
                {#if i !== 0 || isShowUserFirstQuery}
                  {#if editingMessageId === i}
                    <textarea
                      bind:this={editTextArea}
                      class="w-full message-edit-textarea mt-2 bg-secondary p-2 mx-2 border-2 border-themegreyborder resize-none focus:outline-2 focus:outline-themegreen shadow rounded-lg transition-all duration-200 ease-in-out"
                      bind:value={editingMessageContent}
                      on:input={autoExpand}
                      autofocus
                      style="height: 6.5rem; overflow-y: auto;"
                    ></textarea>
                    <div class="flex place-content-center mt-4">
                      <button
                        class="cancel-edit border-2 border-themegreyborder bg-themegreyhover hover:bg-secondary rounded-lg px-3 py-1 mr-2"
                        on:click={() => cancelEdit()}>{$t("app.cancel")}</button
                      >
                      <button
                        class="submit-edit rounded-lg px-3 py-1 mr-2 text-white bg-themegreen
                    {$isStreaming
                          ? 'bg-themegreylight text-white cursor-not-allowed'
                          : 'hover:bg-themegreenhover hover:text-white'}"
                        on:click={() => submitEdit(i)}
                        disabled={$isStreaming}>{$t("app.submit")}</button
                      >
                    </div>
                  {:else}
                    <div
                      class="w-full text-token-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-4px]"
                    >
                      <h5 class="sr-only">{$t("app.username")}:</h5>
                      <div
                        class="message relative flex w-full min-w-0 flex-col"
                      >
                        <div class="flex-col gap-1 md:gap-3">
                          <div class="flex max-w-full flex-col flex-grow">
                            <div
                              class="min-h-[20px] text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words [.text-message+&]:mt-5"
                            >
                              <div
                                class="flex w-full flex-col gap-1 empty:hidden items-end rtl:items-start"
                              >
                                <div
                                  class="group/conversation-turn relative max-w-[70%] rounded-3xl px-3 py-2 bg-[#f4f4f4] rounded-tr-lg"
                                >
                                  <div class="whitespace-pre-wrap">
                                    {message.content}
                                  </div>
                                  <div
                                    class="absolute bottom-0 right-full top-0 -mr-3.5 hidden pr-5 pt-1 [.group\/conversation-turn:hover_&]:block"
                                  >
                                    <button
                                      data-tooltip={$t("app.edit")}
                                      class="btn-custom btn-edit flex items-center justify-center text-token-text-secondary transition"
                                      on:click={() => startEditMessage(i)}
                                    >
                                      <img
                                        class="edit-icon"
                                        alt={$t("app.edit")}
                                        src={EditIcon}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/if}
                {/if}
              {/if}
            {/each}
            <div class="tailblock h-10 w-full"></div>
          </div>
        </div>
      {:else}
        <div class="flex justify-center items-center h-full">
          <p>{$t("app.noConversation")}</p>
        </div>
      {/if}
    </div>
    <div class="inputbox-tools w-full px-2 flex mb-2 mt-1">
      <button on:click={clearMessages} class="py-1 px-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center mr-2">
        <img
        class="delete-icon w-4 h-4 text-blue-500 mr-1"
        alt={$t("app.delete")}
        src={DeleteIcon}
      />
      <span>{$t("topbar.clearConversation")}</span>
      </button>
      <button on:click={feedback} class="py-1 px-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center mr-2">
        <svg class="w-5 h-5 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v2a1 1 0 102 0V6zm0 4a1 1 0 10-2 0v4a1 1 0 102 0v-4z" clip-rule="evenodd"></path>
        </svg>
        <span>{$t("app.feedback")}</span>
      </button>
      <button on:click={openSettings} class="py-1 px-2 border rounded-lg text-gray-700 hover:bg-gray-100 flex items-center">
        <svg class="w-4 h-4 text-blue-500 mr-1" fill="currentColor" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
          <!-- 设置图标 -->
          <path id="路径_3870" data-name="路径 3870" d="M77.5,705.5H70.938a2,2,0,0,0-3.875,0H64.5a.5.5,0,0,0,0,1h2.563a2,2,0,0,0,3.875,0H77.5a.5.5,0,0,0,0-1ZM69,707.016A1.016,1.016,0,1,1,70.016,706,1.016,1.016,0,0,1,69,707.016Z" transform="translate(-64 -694)" fill="#4a928c"/>
          <path id="路径_3871" data-name="路径 3871" d="M77.5,385.5H74.938a2,2,0,0,0-3.875,0H64.5a.5.5,0,1,0,0,1h6.563a2,2,0,0,0,3.875,0H77.5a.5.5,0,0,0,0-1ZM73,387.016A1.016,1.016,0,1,1,74.016,386,1.016,1.016,0,0,1,73,387.016Z" transform="translate(-64 -379)" fill="#4a928c"/>
          <path id="路径_3872" data-name="路径 3872" d="M64.5,66.5h2.563a2,2,0,0,0,3.875,0H77.5a.5.5,0,0,0,0-1H70.938a2,2,0,0,0-3.875,0H64.5a.5.5,0,0,0,0,1ZM69,64.984A1.016,1.016,0,1,1,67.984,66,1.016,1.016,0,0,1,69,64.984Z" transform="translate(-64 -64)" fill="#4a928c"/>
        </svg>
        <span>{$t("topbar.setting")}</span>
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
          class="cursor-pointer hover:themegray transition-colors"
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
            <img src={WaitIcon} alt="wait" class="min-w-[32px] w-[32px]" />
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
  {/if}
</main>

<style>
  @import "../../styles/styles.css";
</style>
