<script lang="ts">
    import { t } from "svelte-i18n";
    import { onMount, onDestroy,createEventDispatcher } from "svelte";
    import { debounce } from 'lodash';
    import pkg from 'lodash'; // Default import
    import CloseIcon from "../assets/close.svg";
    export let isVisible = false; // 控制是否显示

    let shareTopbarContainer: HTMLDivElement;
    let shareTopbar: HTMLDivElement;
    const dispatch = createEventDispatcher();
    // 更新宽度函数
    function updateWidth() {
        if (shareTopbar && shareTopbarContainer) {
        const containerWidth = shareTopbarContainer.offsetWidth;
        shareTopbar.style.width = `${containerWidth}px`;
        }
    }

    // 挂载和销毁生命周期
    onMount(() => {
        updateWidth();
        window.addEventListener("resize", debounce(updateWidth, 100)); // 100ms 防抖
    });

    onDestroy(() => {
        window.removeEventListener("resize", debounce(updateWidth, 100));
    });

    function handleCloseShare() {
      dispatch('closeSharing');
    }

  </script>
    {#if isVisible}
    <div class="shareTopbarContainer w-full" bind:this={shareTopbarContainer}>
        <div
        class="shareTopbar fixed z-50 top-0 px-5 flex justify-between bg-white text-center py-2 transition-opacity duration-300 border-b border-gray-200 min-h-[44px]"
        bind:this={shareTopbar}
        >
        <div class="flex flex-col items-start">
            <h1 class="font-semibold">对话标题</h1>
            <p class="text-gray-500 text-xs">{$t("app.shareConversation", { default: "分享对话" })}</p>
        </div>
        <button
        class="text-gray-500 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-200 p-1
                    max-sm:top-0 max-sm:right-0 max-sm:mt-1 max-sm:mr-1 max-sm:p-2"
        on:click={handleCloseShare}
      >
        <img class="icon-white w-6" alt="Close" src={CloseIcon} />
      </button>
        </div>
    </div>
    {/if}
    
  <style>

  </style>