<script lang="ts">                                                                      
    export let message: any;
    import SvelteMarkdown from "svelte-markdown";
    import { t } from "svelte-i18n";
    import { createEventDispatcher, onMount, afterUpdate } from "svelte"; // Import onMount and afterUpdate
    import{formatMessageForMarkdown} from "../utils/generalUtils";

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

    import UUGPTIcon from "../assets/uugpt_favion_small.png";
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

    
</script>
{#if message.message.role === "user"}
<article class="w-full">
    <div
      class="m-auto py-3 px-4 w-full">
        <div class="mx-auto flex flex-1 gap-4 max-w-full">
            <div class="group relative flex w-full min-w-0 flex-col">
                <div class="flex-col gap-1 md:gap-3">
                  <div class="flex max-w-full flex-col flex-grow">
                    <div
                        data-message-author-role="user"
                        data-message-id={message.mid}
                        class="min-h-8 text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words"
                        >
                        <div
                            class="flex w-full flex-col gap-1 empty:hidden items-end content-center"
                        >
                            <div
                            class="group/conversation-turn relative max-w-[var(--user-chat-width,70%)] rounded-3xl bg-gray-100 px-5 py-2.5"
                            >
                            <!-- 消息内容 -->
                                <div class="whitespace-pre-wrap">
                                    {message.message.content}
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>
</article>
{:else if message.message.role === "assistant"}
<article class="w-full" dir="auto" data-scroll-anchor="false">
    <div class="m-auto text-base px-4 py-3 mb-2">
        <div class="mx-auto flex flex-1 flex-col gap-2 text-base max-w-full">
            <div class="flex flex-row relative items-start gap-2 flex-wrap content-center">
              <img
                src={UUGPTIcon}
                alt="Profile"
                class="w-[1.5rem] h-[1.5rem]"
              />
              <span class="text-heavy">{$t("app.appname", { default: "uuGPT" })}{$t("app.websiteDescription", {
                default: " - Multi-Model AI Assistant",
            })}:</span>
            </div>
            <div class="group/conversation-turn relative flex w-full min-w-0 flex-col agent-turn"                >
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
                                class="flex w-full flex-col gap-1 empty:hidden first:pt-[3px] share-message-display"
                            >
                                <SvelteMarkdown
                                {renderers}
                                source={formatMessageForMarkdown(
                                    message.message.content.toString(),
                                )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</article>
{/if}

<style>
    
    /* 引用块样式 */

</style>