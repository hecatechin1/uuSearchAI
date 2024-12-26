<script lang="ts">
  export let message;
  export let index;
  import { t } from "svelte-i18n"; // 导入本地化方法
  import SvelteMarkdown from "svelte-markdown"; //导入svelte-markdown
  import { isStreaming } from "../stores/globalParamentStores";
  //导入渲染器
  import CodeRenderer from "../renderers/Code.svelte";
  import LinkRenderer from "../renderers/LinkRenderer.svelte";
  import UserCodeRenderer from "../renderers/userCode.svelte";
  import EmRenderer from "../renderers/Em.svelte";
  import ListRenderer from "../renderers/ListRenderer.svelte";
  import ListItemRenderer from "../renderers/ListItem.svelte";
  import CodeSpanRenderer from "../renderers/CodeSpan.svelte";
  import ParagraphRenderer from "../renderers/Paragraph.svelte";
  import HtmlRenderer from "../renderers/Html.svelte";

  //导入所需图标
  import CopyIcon from "../assets/copy.svg";
  import RetryIcon from "../assets/retry.svg";
  import RobotIcon from "../assets/aianswer-avtar.svg";
  import EditIcon from "../assets/edit.svg";
  import DeleteIcon from "../assets/delete.svg";
  import gptIcon from "../assets/gpt.svg";
  import toggleIcon from "../assets/toggle.svg";

  //导入通用方法
  import {
    copyTextToClipboard,
    formatMessageForMarkdown,
  } from "../utils/generalUtils";
  import {get} from "svelte/store";
    import { getMessage } from "../manages/chatManages";
    import { current_chat } from "../stores/chatStores";

  let isShowUserFirstQuery = true; //是否显示用户的第一个问题
  // let isStreaming = false;//是否在进行流式传输
  let isEditting = false; //是否正在编辑
  let editTextArea;
  let editingMessageContent: string; //正在编辑的消息内容;
  let retrybtn;
  const autoExpand = () => {
    //自动展开
  };

  const copyText = (content: string, index: number) => {
    //复制文本
    copyTextToClipboard(content.replaceAll('\\n','\n'));
    let copyelm = document.getElementsByClassName("copyAnime" + index)[0];
    copyelm.classList.add("small-rotate-animation");
    setTimeout(() => {
      copyelm.classList.remove("small-rotate-animation");
    }, 500);
  };

  const likeMessage = () => (message.likes = true);
  const dislikeMessage = () => (message.dislikes = true);
  const retryMessage = () =>
    alert($t("app.retrying", { default: "Retrying..." }));

  const renderers = {
    code: CodeRenderer,
    em: EmRenderer,
    list: ListRenderer,
    listitem: ListItemRenderer,
    paragraph: ParagraphRenderer,
    html: HtmlRenderer,
    link: LinkRenderer,
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
  function deleteMessage(index: number) {}

  async function retry(index:number) {
    let user_message = get(current_chat)[index-1];
    await getMessage(user_message.message.content,user_message.ai,user_message.model);
  }
  function cancelEdit() {}
  function submitEdit(index: number) {}

  function startEditMessage(index: number) {}
</script>

{#if message.role === "assistant"}
<article
class="w-full scroll-mb-[var(--thread-trailing-height,150px)] text-token-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-4px]"
dir="auto"
data-testid="conversation-turn-53"
data-scroll-anchor="false"
>
<h6 class="sr-only">{$t("app.assistantname", { default: "uuGPT" })}</h6>
<div
  class="m-auto text-base py-[18px] px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5"
>
  <div
    class="mx-auto flex flex-1 gap-2 text-base md:gap-3 lg:gap-4 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"
  >
    <div class="flex-shrink-0 flex flex-col relative items-end">
      <div>
        <div class="pt-0">
          <div
            class="gizmo-shadow-stroke flex h-8 w-8 items-center justify-center overflow-hidden rounded-full"
          >
            <div class="h-full w-full">
              <div
                class="gizmo-shadow-stroke relative flex h-full items-center justify-center rounded-full bg-token-main-surface-primary text-token-text-primary"
              >
              <img src={RobotIcon} alt="Profile" class="w-[1.5rem] h-[1.5rem]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="group/conversation-turn relative flex w-full min-w-0 flex-col agent-turn"
    >
      <div class="flex-col gap-1 md:gap-3">
        <div class="flex max-w-full flex-col flex-grow">
        
          <div
            data-message-author-role="assistant"
            data-message-id={message.mid}
            dir="auto"
            class="min-h-8 text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words text-start [.text-message+&amp;]:mt-5"
            data-message-model-slug={message.model}
          >
            <div
              class="flex w-full flex-col gap-1 empty:hidden first:pt-[3px] message-display"
            >
                <SvelteMarkdown
                {renderers}
                source={formatMessageForMarkdown(message.content.toString())}
              />
            </div>
          </div>
        </div>

        <!-- 消息工具栏 -->
        {#if $isStreaming === false}
        <div class="toolbelt flex gap-2 empty:hidden">
          <div class="flex justify-start rounded-xl items-center ml-[-0.6rem]">
            <button
              class="btn-custom"
              data-tooltip={$t("app.copy")}
              on:click={() => copyText(message.content, index)}
            >
              <img
                alt={$t("app.copy")}
                src={CopyIcon}
                class={"copy-icon copyAnime" + index}
              />
            </button>
            <button
              class="deleteButton btn-custom"
              data-tooltip={$t("app.delete")}
              on:click={() => deleteMessage(index)}
            >
              <img class="delete-icon" alt={$t("app.delete")} src={DeleteIcon} />
            </button>
  
            <button
              bind:this={retrybtn}
              class="btn-custom"
              data-tooltip={$t("app.retry")}
              on:click={() => retry(index)}
            >
              <img class="" alt={$t("app.retry")} src={RetryIcon} />
            </button>

            <button
              class="btn-custom btn-switch"
              data-tooltip={$t("settings.switchMode")}
              
            >
              <img class="h-4 w-4" alt={$t("settings.switchMode")} src={gptIcon} />
              <span class="btn-text">{message.ai} {message.model}</span>
              <span class="h-2 w-2">
                <img class="h-2 w-2" alt={$t("settings.switchMode")} src={toggleIcon} />
              </span>
            </button>
          </div>
        </div>
      {/if}

        <div class="pr-2 lg:pr-0"></div>
      </div>
    </div>
  </div>
</div>
</article>
{:else if message.role === "user"}
  <article class="w-full focus-visible:outline-offset-[-4px]">
    <h5 class="sr-only">{$t("app.youSaid", { default: "You Said:" })}</h5>
    <div
      class="m-auto text-base py-[18px] px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5"
    >
      <div
        class="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"
      >
        <div class="group relative flex w-full min-w-0 flex-col">
          <div class="flex-col gap-1 md:gap-3">
            <div class="flex max-w-full flex-col flex-grow">
              {#if isEditting}
                <!-- 编辑消息的文本区域 -->
                <div class="rounded-3xl bg-gray-100 px-3 py-3">
                  <div class="m-2 max-h-[25dvh] overflow-auto">
                    <div class="grid">
                      <textarea
                        class="col-start-1 col-end-2 row-start-1 row-end-2 resize-none overflow-y-auto p-0 m-0 w-full border-0 bg-transparent focus:outline-none"
                        >{message.content}</textarea
                      ><span
                        class="invisible col-start-1 col-end-2 row-start-1 row-end-2 whitespace-pre-wrap p-0"
                      >
                        {message.content}
                      </span>
                    </div>
                  </div>
                  <div class="flex justify-end gap-2">
                    <button
                      class="cancel-edit border-2 border-themegreyborder bg-themegreyhover hover:bg-secondary rounded-lg px-3 py-1"
                      on:click={() => cancelEdit()}
                      >{$t("app.cancel")}
                    </button>
                    <button
                      class="submit-edit rounded-lg px-3 py-1 mr-2 text-white bg-themegreen
                                  {$isStreaming
                        ? 'bg-themegreylight text-white cursor-not-allowed'
                        : 'hover:bg-themegreenhover hover:text-white'}"
                      on:click={() => submitEdit(index)}
                      disabled={$isStreaming}
                      >{$t("app.submit")}
                    </button>
                  </div>
                </div>
              {:else}
                <div
                  data-message-author-role="user"
                  data-message-id={message.mid}
                  class="min-h-8 text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words text-start [.text-message+&amp;]:mt-5"
                >
                  <div
                    class="flex w-full flex-col gap-1 empty:hidden items-end"
                  >
                    <div
                      class="group/conversation-turn relative max-w-[var(--user-chat-width,70%)] rounded-3xl bg-gray-100 px-5 py-2.5"
                    >
                      <!-- 消息内容 -->
                      <div class="whitespace-pre-wrap">
                        {message.content}
                      </div>

                      <!-- 消息编辑按钮 -->
                      <div
                        class="absolute bottom-0 right-full top-0 -mr-3.5 hidden pr-5 pt-1 [.group\/conversation-turn:hover_&]:block"
                      >
                        <button
                          data-tooltip={$t("app.edit")}
                          class="btn-custom btn-edit flex items-center justify-center text-token-text-secondary transition"
                          on:click={() => startEditMessage(index)}
                        >
                          <img
                            class="edit-icon"
                            alt={$t("app.edit", { default: "Edit" })}
                            src={EditIcon}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
{/if}

<style>
  @import "../styles/styles.css";
</style>
