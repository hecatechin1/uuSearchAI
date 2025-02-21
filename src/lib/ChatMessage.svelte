<script lang="ts">
  export let message;
  export let index:number;
  import { t } from "svelte-i18n"; // 导入本地化方法
  import SvelteMarkdown from "svelte-markdown"; //导入svelte-markdown
  import { isStreaming, showErrorMessage, showSuccess, showSuccessMessage } from "../stores/globalParamentStores";
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
  import MoreIcon from "../assets/more.svg";
  import gptIcon from "../assets/gpt.svg";
  import ClaudeIcon from "../assets/claude.svg";
  import GeminiIcon from "../assets/gemini.svg";
  import toggleIcon from "../assets/toggle.svg";
  import errorIcon from "../assets/pricing/failure.svg";
  //导入通用方法
  import {
    copyTextToClipboard,
    formatMessageForMarkdown,
    clickOutside,
    getElementPostionDiff
  } from "../utils/generalUtils";
  import { get } from "svelte/store";
  import { deleteMessageData, getMessage } from "../manages/chatManages";
  import { current_chat, current_chat_ai, current_chat_id, current_chat_model,getAiName,getModelName } from "../stores/chatStores";
  import { onMount,createEventDispatcher,afterUpdate } from "svelte";
  import DeleteMessageContexMenu from "./DeleteMessageContexMenu.svelte";
  let dispatch = createEventDispatcher();
  let showModelSelectorbtn:HTMLElement;
  let isShowUserFirstQuery = true; //是否显示用户的第一个问题
  // let isStreaming = false;//是否在进行流式传输
  let isEditting = false; //是否正在编辑
  let editTextArea;
  let editingMessageContent: string; //正在编辑的消息内容;
  let retrybtn;
  let ast_ai = getAiName(message.message.role=='user'? message.ai : get(current_chat)[index-1].ai);
  let ast_model = getModelName(message.message.role=='user'? message.model : get(current_chat)[index-1].model);
  let isShowDeleteMenu = false;
  let menuLeft:number;
  let menuTop:number;
  let menuRight:number;
  let menuBottom:number;
  let deleteMessageBtn:HTMLElement;
  let messageError = message.error_code != 0;
  let messageErrorType = message.error_code;
  let showMenu = false;
  const autoExpand = () => {
    //自动展开
  };

  const copyText = (content: string, index: number) => {
    //复制文本
    copyTextToClipboard(content.replaceAll("\\n", "\n"));
    let copyelm = document.getElementsByClassName("copyAnime" + index)[0];
    copyelm.classList.add("small-rotate-animation");
    setTimeout(() => {
      copyelm.classList.remove("small-rotate-animation");
    }, 500);
  };


  function showModelSelector(){
    let position = getElementPostionDiff(showModelSelectorbtn);
    dispatch("show-selector", { position:position,callback:selectedCallback});
  }
  async function selectedCallback(ai:string,model:string){
    let msg = get(current_chat)[index-1].message.content;
    await getMessage(msg,ai,model);
  }

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

  function deleteMessage(index: number) {
    let d = getElementPostionDiff(deleteMessageBtn);
    menuLeft = d.left;
    menuRight = d.right;
    menuTop = d.top;
    menuBottom = d.bottom;
    isShowDeleteMenu = true;
  }

  function hideMenu(){
    isShowDeleteMenu = false;
  }
  async function deleteThisMessage(){
    hideMenu();
    let d = await deleteMessageData(index);
    if(d!=0){
      showErrorMessage(d);
    }else{
      showSuccessMessage('删除成功');
    }
  }

  async function deleteToEnd(){
    hideMenu();
    let d = await deleteMessageData(index,true);
    if(d!=0){
      showErrorMessage(d);
    }else{
      showSuccessMessage('删除成功');
    }
  }

  async function retry(index: number) {
    let user_message = get(current_chat)[index - 1];
    await getMessage(
      user_message.message.content,
      user_message.ai,
      user_message.model,
    );
  }
  function cancelEdit() {}
  function submitEdit(index: number) {}

  function startEditMessage(index: number) {}

  onMount(() => {});
  afterUpdate(() => {
    showMenu = get(current_chat).length-1 == index ? !get(isStreaming) : true;
  });
</script>

{#if message.message.role === "assistant"}
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
                    <img
                      src={RobotIcon}
                      alt="Profile"
                      class="w-[1.5rem] h-[1.5rem]"
                    />
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
              {#if !messageError}
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
                    source={formatMessageForMarkdown(
                      message.message.content.toString(),
                    )}
                  />
                </div>
              </div>
              {/if}
              {#if messageError && messageErrorType == "500"}
              
               <!-- TODO: 如果服务端发生错误500, 链接不上服务器 显示这个标签，隐藏同级标签和消息工具栏 -->
                <div class="flex">
                  <div class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg inline-block max-w-full">
                    <img src={errorIcon} alt="Error" class="w-6 h-6 mr-1 inline-flex" />
                    <span>服务端错误，点击重试</span>
                  </div>
                </div>
                {/if}
                {#if messageError && messageErrorType == "104"}
                
                <!-- TODO: 如果服务端发生错误类型，设备超出限制 显示这个标签，隐藏同级标签和消息工具栏 -->
                <div class="flex">
                  <div class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg inline-block max-w-full">
                    <img src={errorIcon} alt="Error" class="w-6 h-6 mr-1 inline-flex" />
                    <span>设备数超出限制。您当前的可同时使用设备数为(deviceLimit)台。如需增加可用设备数请<a href="./pricing" target="_blank" class="font-bold underline text-red-700 px-2">升级计划</a>。请注意，不同的浏览器会被记为多台设备。</span>
                  </div>
                </div>
                {/if}
                {#if messageError && messageErrorType == "103"}
                
                <!-- TODO: 如果token或对话次数额度超限 显示这个标签，隐藏同级标签和消息工具栏 -->
                <div class="flex">
                  <div class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg inline-block max-w-full">
                    <img src={errorIcon} alt="Error" class="w-6 h-6 mr-1 inline-flex" />
                    <span>当前模型对话限额已用尽，请更换其他模型或<a href="./pricing" target="_blank" class="font-bold underline text-red-700 px-2">升级计划</a>。</span>
                  </div>
                </div>
                {/if}
                {#if messageError && messageErrorType == "102"}
                
                <!-- TODO: 如果使用中的计划到期 显示这个标签，隐藏同级标签和消息工具栏 -->
                <div class="flex">
                  <div class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded-lg inline-block max-w-full">
                    <img src={errorIcon} alt="Error" class="w-6 h-6 mr-1 inline-flex" />
                    <span>您的订阅已经到期，请<a href="./pricing" target="_blank" class="font-bold underline text-red-700 px-2">升级计划</a>继续使用。</span>
                  </div>
                </div>
                {/if}
            </div>
            
            <!-- 消息工具栏 -->
            {#if showMenu}
              <div class="toolbelt flex gap-2 empty:hidden">
                <div
                  class="relative flex justify-start rounded-xl items-center ml-[-0.6rem]"
                >
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
                    bind:this={retrybtn}
                    class="btn-custom"
                    data-tooltip={$t("app.retry")}
                    on:click={() => retry(index)}
                  >
                    <img class="" alt={$t("app.retry")} src={RetryIcon} />
                  </button>

                  <button
                  bind:this={showModelSelectorbtn}
                  on:click={showModelSelector}

                    class="btn-custom btn-switch"
                    data-tooltip={$t("settings.switchMode")}
                  >
                    <img
                      class="h-4 w-4"
                      alt={$t("settings.switchMode")}
                      src={ast_ai == 'GPT'? gptIcon : ast_ai == 'Claude'? ClaudeIcon : GeminiIcon}
                    />
                    <span class="btn-text">{ast_ai} {ast_model}</span>
                    <span class="h-2 w-2">
                      <img
                        class="h-2 w-2"
                        alt={$t("settings.switchMode")}
                        src={toggleIcon}
                      />
                    </span>
                  </button>

                  <button
                  bind:this={deleteMessageBtn}
                    class="moreButton btn-custom"
                    data-tooltip={$t("app.delete")}
                    on:click={() => deleteMessage(index)}
                  >
                    <img
                      class="delete-icon"
                      alt={$t("app.delete")}
                      src={MoreIcon}
                    />

                  </button>

                  {#if isShowDeleteMenu }
                  <div use:clickOutside={hideMenu} style="z-index : 50">
                    <DeleteMessageContexMenu
                      left={menuLeft}
                      top={menuTop}
                      right={menuRight}
                      bottom={menuBottom}
                      on:deleteThisMessage={deleteThisMessage}
                      on:deleteToTheEnd={deleteToEnd}
                    />
                  </div>
                  {/if}
                </div>
              </div>
            {/if}

            <div class="pr-2 lg:pr-0"></div>
          </div>

         
        </div>
      </div>

     
    </div>
  </article>
{:else if message.message.role === "user"}
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
                        >{message.message.content}</textarea
                      ><span
                        class="invisible col-start-1 col-end-2 row-start-1 row-end-2 whitespace-pre-wrap p-0"
                      >
                        {message.message.content}
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
                        {message.message.content}
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
