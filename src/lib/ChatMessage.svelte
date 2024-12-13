<script lang="ts">
    export let message;
    export let index;

    import {t} from 'svelte-i18n'; // 导入本地化方法
    import SvelteMarkdown from "svelte-markdown"; //导入svelte-markdown
    import {isStreaming} from "../stores/globalParamentStores";
    //导入渲染器
    import CodeRenderer from "../renderers/Code.svelte";
    import LinkRenderer from "../renderers/LinkRenderer.svelte";
    import Devideline from "../renderers/Devideline.svelte";
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
    import UserIcon from "../assets/UserIcon.svg";
    import RobotIcon from "../assets/aianswer-avtar.svg";
    import MoreIcon from "../assets/moreactions.svg";
    import EditIcon from "../assets/edit.svg";
    import LikeIcon from "../assets/helpful.svg";
    import DislikeIcon from "../assets/unhelpful.svg";
    import LikeActiveIcon from "../assets/helpful-checked.svg";
    import DislikeActiveIcon from "../assets/unhelpful-checked.svg";
    import DeleteIcon from "../assets/delete.svg";

    //导入通用方法
    import { 
        copyTextToClipboard,
        formatMessageForMarkdown,
    } from "../utils/generalUtils";

    let isShowUserFirstQuery = true; //是否显示用户的第一个问题
    // let isStreaming = false;//是否在进行流式传输
    let isEditting = false; //是否正在编辑
    let editTextArea;
    let editingMessageContent: string; //正在编辑的消息内容;
    let retrybtn;
    const autoExpand = () => {
        //自动展开
    };

    const copyText = (a:string,b:number) => {
        //复制文本
    };

    const likeMessage = () => (message.likes = true);
    const dislikeMessage = () => (message.dislikes = true);
    const retryMessage = () => alert($t('app.retrying', { default: 'Retrying...' }));

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
    function deleteMessage(index:number){

    }
    function toggleLike(index: number){

    }
    function toggleDislike(index: number){

    }
    function retry(index){
        console.log('对话框-换模型',retrybtn.getBoundingClientRect().top);
    }
    function cancelEdit(){

    }
    function submitEdit(index:number){

    }

    function startEditMessage(index:number){

    }
</script>

<div class="mx-auto flex flex-1 gap-4 text-base md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
    {#if message.role === "assistant"}
        <div class="message relative inline-block bg-primary mt-0 flex flex-col transition-all duration-200 ease-in-out">
            <!-- 系统消息头像 -->
            <div class="profile-picture flex align-middle">
                <div>
                    <img src={RobotIcon} alt="Profile" class="w-[1.5rem] h-[1.5rem]"/>
                </div>
                <div class="relative ml-2 font-bold">
                    {$t('app.assistantname', { default: 'uuGPT' })}
                </div>
            </div>

            <!-- 系统消息正文 -->
            <div class="message-display mt-2 transition-all duration-200 ease-in-out">
                <SvelteMarkdown
                    {renderers}
                    source={formatMessageForMarkdown(
                    message.content.toString(),
                )}
                />
            </div>

            <!-- 系统消息的流式传输完成后，显示AI消息工具栏 -->
            {#if $isStreaming === false}
                <div class="toolbelt flex gap-3 empty:hidden -ml-2">
                    <div class="flex justify-start rounded-xl items-center">
                        <button

                            class="btn-custom copyButton"
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
                        <img
                            class="delete-icon"
                            alt={$t("app.delete")}
                            src={DeleteIcon}
                        />
                        </button>

                        <!-- <button
                        id="likeBtn"
                        class="btn-custom"
                        data-tooltip={$t("app.like")}
                        on:click={() => toggleLike(index)}
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
                        on:click={() => toggleDislike(index)}
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
                        </button> -->

                        <button
                        bind:this={retrybtn}
                            class="btn-custom"
                            data-tooltip={$t("app.retry")}
                            on:click={() => retry(index)}
                            >
                            <img class="" alt={$t("app.retry")} src={RetryIcon} />
                            <span class="btn-text">{"AI"+"model"}</span>
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    {:else if message.role === "user"}
        {#if isEditting}
            <textarea bind:this={editTextArea}
                class="w-full message-edit-textarea mt-2 bg-secondary p-2 mx-2 border-2 border-themegreyborder resize-none focus:outline-2 focus:outline-themegreen shadow rounded-lg transition-all duration-200 ease-in-out"
                bind:value={editingMessageContent}
                on:input={autoExpand}
                autofocus
                style="height: 6.5rem; overflow-y: auto;"
            ></textarea>
            <div class="flex place-content-center mt-4">
                <button
                    class="cancel-edit border-2 border-themegreyborder bg-themegreyhover hover:bg-secondary rounded-lg px-3 py-1 mr-2"
                    on:click={() => cancelEdit()}>{$t("app.cancel")}
                </button>
                <button
                    class="submit-edit rounded-lg px-3 py-1 mr-2 text-white bg-themegreen
                    {$isStreaming
                        ? 'bg-themegreylight text-white cursor-not-allowed'
                        : 'hover:bg-themegreenhover hover:text-white'}"
                        on:click={() => submitEdit(index)}
                        disabled={$isStreaming}>{$t("app.submit")
                    }
                </button>
            </div>
        {:else}
            <div class="w-full text-token-text-primary focus-visible:outline-2 focus-visible:outline-offset-[-4px]">
                
                <h5 class="sr-only">{$t("app.username",{default:"You"})}:</h5>
                
                <div class="message relative flex w-full min-w-0 flex-col">
                    <div class="flex-col gap-1 md:gap-3">
                        <div class="flex max-w-full flex-col flex-grow">
                            <div class="min-h-[20px] text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words [.text-message+&]:mt-5">
                                <div class="flex w-full flex-col gap-1 empty:hidden items-end rtl:items-start">
                                    <div class="group/conversation-turn relative max-w-[70%] rounded-3xl px-3 py-2 bg-[#f4f4f4] rounded-tr-lg">
                                        
                                        <!-- 消息内容 -->
                                        <div class="whitespace-pre-wrap">
                                            {message.content}
                                        </div>

                                        <!-- 消息编辑按钮 -->
                                        <div class="absolute bottom-0 right-full top-0 -mr-3.5 hidden pr-5 pt-1 [.group\/conversation-turn:hover_&]:block">
                                            <button
                                                data-tooltip={$t("app.edit")}
                                                class="btn-custom btn-edit flex items-center justify-center text-token-text-secondary transition"
                                                on:click={() => startEditMessage(index)}
                                            >
                                                <img class="edit-icon" alt={$t("app.edit",{default:"Edit"})} src={EditIcon}/>
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
</div>
<style>
    @import "../styles/styles.css";
</style>