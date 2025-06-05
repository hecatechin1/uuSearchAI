<script lang="ts">
    import { t } from "svelte-i18n";
    import { createEventDispatcher,onMount } from "svelte";
    import CloseIcon from "../assets/close.svg";
    import XIcon from "../assets/x.svg";
    import WeChatIcon from "../assets/wechat.svg";
    import { showErrorMessage, showSuccessMessage } from "../stores/globalParamentStores";
  
    export let isOpen = false;
    export let shareLink :string; // 模拟生成的分享链接
      let isMobile: boolean = false;
    const dispatch = createEventDispatcher();
  
    function closeModal() {
      dispatch("close");
    }
    onMount(() => {
      // 检查是否是移动设备
      isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    });
    // 复制链接功能
    function copyLink(event:any,dontShowToast:boolean = false) {
      navigator.clipboard.writeText(shareLink).then(() => {
        // alert($t("app.linkCopied", { default: "Link copied to clipboard!" }));
        if(dontShowToast) return;
        showSuccessMessage($t("app.linkCopied", { default: "Link copied to clipboard!" }));
      }).catch(err => {
        console.error("Failed to copy link:", err);
        showErrorMessage($t("app.linkCopyFailed", { default: "Failed to copy link. Please try again." }));
      });
    }
  
    // 分享到 WeChat 占位函数
    function shareToWeChat() {
      copyLink(null,true);
        // console.log("Share to WeChat logic to be implemented");
        showSuccessMessage($t("app.wechatLinkInstructions", {
        default: "Link copied! Long press in the WeChat chat input box to paste and share with friends."
      }));
    }
  
    // 分享到 X 占位函数
    function shareToX() {
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURI(shareLink)}`,
            "twitter-share",
            "width=550,height=420,left=100,top=100",
        );
    }



        //移动端分享
    async function mobileShare() {
        navigator.share({
            title: "Share to WeChat",
            text: "Check out this amazing content!",
            url: shareLink, // 分享链接
        });
    }
  </script>
  
  {#if isOpen}
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      on:click={closeModal}
    >
      <div
        class="bg-white rounded-lg shadow-lg relative max-w-[720px] w-full mx-5 flex flex-col justify-between"
        on:click|stopPropagation
      >
        <!-- 标题和关闭按钮 -->
        <div class="flex justify-between items-center py-1 px-4">
          <h2 class="text-lg font-bold mt-3 mb-3">
            {$t("app.shareLinkTitle", { default: "Share Link" })}
          </h2>
          <button
            class="text-gray-500 hover:bg-gray-100 rounded p-2"
            on:click={closeModal}
            aria-label="Close"
          >
            <img class="w-6 h-6" alt="Close" src={CloseIcon} />
          </button>
        </div>
  
        <!-- 分割线 -->
        <div class="border-b border-gray-200"></div>
  
        <!-- 中间部分：文本框和复制按钮 -->
        <div class="p-4 flex-1 flex flex-col justify-center">
            <p class="text-sm text-gray-600 mb-4 ml-1">
                {$t("app.shareLinkDescription", { default: "Share this conversation with others using the link below" })}
            </p>
            <div class="flex items-center gap-2 flex-wrap: wrap">
                <input
                type="text"
                class="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-themegreen"
                value={shareLink}
                readonly
                />
                <button
                class="bg-themegreen text-white px-3 py-2 rounded-lg hover:bg-themegreenhover text-sm"
                on:click={copyLink}
                >
                {$t("app.copyLink", { default: "Copy Link" })}
                </button>
          </div>
        </div>
  
        <!-- 底部按钮区域 -->
        <div class="p-4 px-6 flex justify-between items-center gap-4">
          <div class="flex gap-4 items-center text-sm flex-wrap">
            <span>{$t("app.sharetoText", { default: "Share to:" })}</span>
            <button
              class="rounded text-sm"
              on:click={shareToWeChat}
            >
              <img src={WeChatIcon} alt={$t("app.shareWeChat", { default: "Share to WeChat" })} class="w-6 h-6" />
            </button>
            <button
              class="rounded text-sm"
              on:click={shareToX}
            >
              <img src={XIcon} alt={$t("app.shareX", { default: "Share to X" })} class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .overflow-y-auto {
      -webkit-overflow-scrolling: touch;
    }
  </style>