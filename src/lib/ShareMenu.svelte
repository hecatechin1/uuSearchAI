<script>
    import { fade } from "svelte/transition";
    import { onMount, createEventDispatcher } from "svelte";
    import { t } from "svelte-i18n";
    import deleteAllIcon from "../assets/delete.svg";
    import deleteIcon from "../assets/delete2.svg";
    import {
        showSuccessMessage,
        showErrorMessage,
    } from "../stores/globalParamentStores";
    import { renameChat, deleteChatData } from "../manages/chatManages";
    export let left = 0;
    export let right = 0;
    export let top = 0;
    export let bottom = 0;
    export let content = "";
    //  const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`;
    // https://www.facebook.com/sharer/sharer.php?u=%E3%80%90URL%E3%80%91&quote=%E3%80%90%E6%8F%8F%E8%BF%B0%E6%96%87%E6%9C%AC%E3%80%91
    let dispatch = createEventDispatcher();
    function close() {
        dispatch("close");
    }
    function xSharing() {
        window.open(
            `https://twitter.com/intent/tweet?text=${content}&url=${encodeURI("uugpt.com/chat")}`,
            "twitter-share",
            "width=550,height=420,left=100,top=100",
        );
        close();
    }

    function facebookSharing() {
        window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURI('uugpt.com/chat')}&quote=${encodeURI(content)}`,
            "twitter-share",
            "width=550,height=420,left=100,top=100",
        );
        close();
    }
</script>

<div
    class="z-50 absolute py-2 max-w-[250px] bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 max-h-[300px] overflow-y-auto dropdown-menu"
    style="position: fixed;"
    style:left={left > 0 ? `${left}px` : undefined}
    style:top={top > 0 ? `${top}px` : undefined}
    style:right={right > 0 ? `${right}px` : undefined}
    style:bottom={bottom > 0 ? `${bottom}px` : undefined}
    transition:fade={{ duration: 300 }}
>
    <div
        on:click={xSharing}
        role="button"
        tabindex="0"
        on:keydown={() => {}}
        class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3"
    >
        <div
            class="flex items-center justify-center text-token-text-secondary h-5 w-5 flex-shrink-0"
        >
            <img src={deleteIcon} alt="Rename chat" />
        </div>
        <span
            class="whitespace-normal break-words hyphens-auto flex-1"
            style="word-break: break-word;"
            >{$t("app.deleteThisMessage", {
                default: "Delete this message",
            })}</span
        >
    </div>

    <div
        on:click={facebookSharing}
        role="button"
        tabindex="0"
        on:keydown={() => {}}
        class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3"
    >
        <div
            class="flex items-center justify-center text-token-text-secondary h-5 w-5 flex-shrink-0"
        >
            <img src={deleteAllIcon} alt="Delete chat" class="ml-[-2px]" />
        </div>
        <span
            class="whitespace-normal break-words hyphens-auto flex-1"
            style="word-break: break-word;"
            >{$t("app.deleteToTheEnd", { default: "Delete to the End" })}</span
        >
    </div>
</div>
