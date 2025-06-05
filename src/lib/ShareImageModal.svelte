<script lang="ts">
    import { t } from "svelte-i18n";
    import { createEventDispatcher, onMount, afterUpdate } from "svelte"; // Import onMount and afterUpdate
    import SvelteMarkdown from "svelte-markdown";
    import ShareChatMessage from "./ShareChatMessage.svelte";
    import { drawQRCode, convertToImage } from "../utils/generalUtils";
    import CloseIcon from "../assets/close.svg";
    import XIcon from "../assets/x.svg";
    import WeChatIcon from "../assets/wechat.svg";
    import UUGPTIcon from "../assets/uugpt_favion_big.png";
    import { current_chat } from "../stores/chatStores";
    import { get, writable } from "svelte/store";
    import { showSuccessMessage } from "../stores/globalParamentStores";

    export let shareUrl: string;
    // export let messages: any[] = [];
    export let currentTime: string = new Date().toLocaleString();
    export let shareIndexs: any[];
    let isReady = false;
    let shareMessagesShow: HTMLDivElement;
    let showFadeEffect = false;
    let qrCanvas: HTMLCanvasElement;
    let qrSize: number = 128;
    let shareMessages: any[] = [];
    let shareImageOriginal: HTMLElement;
    let imageUrl: string;
    let qrcodeUrl: string;
    let isMobile: boolean = false;
    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("close");
    }

    // 占位函数：下载图片
    function downloadImage() {
        if (!imageUrl) return;
        const link = document.createElement("a");
        link.download = "div-snapshot.png";
        link.href = imageUrl;
        link.click();
    }

    // 占位函数：分享到微信
    async function shareToWeChat() {
        copyImageToClipboard(null, true);
        showSuccessMessage(
            $t("app.wechatInstructions", {
                default:
                    "Image copied to clipboard! Long press the WeChat chat input box to paste, or save the image and upload to Moments.",
            }),
        );
    }
    //移动端分享
    async function mobileShare() {
        let file = await dataUrlToFile(imageUrl);
        navigator.share({
            title: $t("app.title", { default: "uuGPT" }),
            text: $t("app.description", { default: "uuGPT is an intelligent chat platform integrating top AI models, featuring one-click Google login. Free access to GPT-4 mini. Subscribe Pro to unlock GPT-3.5/Claude 3.7 and more advanced models for writing, coding, translation, and more." }),
            files: [file],
            url: shareUrl, // 分享链接
        });
    }

    // 占位函数：分享到 X
    function shareToX() {
        copyImageToClipboard(null, true);
        console.log(encodeURI(shareUrl));
        showSuccessMessage(
            $t("app.xInstructions", {
                default:
                    "Image copied! Paste it in the X post input box to share.",
            }),
        );
        window.open(
            `https://twitter.com/intent/tweet?url=${encodeURI(shareUrl)}`,
            "twitter-share",
            "width=550,height=420,left=100,top=100",
        );
    }

    async function copyImageToClipboard(
        event: any = null,
        dontShowToast: boolean = false,
    ) {
        if (!imageUrl) return;

        try {
            // 提取 Base64 数据和 MIME 类型
            const parts = imageUrl.split(";base64,");
            const mimeType = parts[0].split(":")[1]; // 例如 "image/png"
            const base64Data = parts[1];

            // 将 Base64 转换为二进制数据
            const byteCharacters = atob(base64Data);
            const byteArrays = [];

            for (
                let offset = 0;
                offset < byteCharacters.length;
                offset += 512
            ) {
                const slice = byteCharacters.slice(offset, offset + 512);
                const byteNumbers = new Array(slice.length);

                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }

            // 创建 Blob 对象
            const blob = new Blob(byteArrays, { type: mimeType });

            // 复制到剪贴板
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob,
                }),
            ]);
            if (dontShowToast) return;
            showSuccessMessage(
                $t("app.imageCopied", {
                    default: "Image copied to clipboard!",
                }),
            );
        } catch (err) {
            console.error(
                $t("app.imageCopyFailed", {
                    default: "Failed to copy link. Please try again.",
                }),
                err,
            );
        }
    }
    function dataUrlToFile(dataUrl, fileName = "image.png") {
        // 提取 Base64 部分
        const arr = dataUrl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);

        // 转换为 Uint8Array
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        // 创建 File 对象
        return new File([u8arr], fileName, { type: mime });
    }

    // 检查内容高度并更新渐隐效果
    function checkHeight() {
        if (shareMessagesShow) {
            console.log("shareMessagesShow:", shareMessagesShow.scrollHeight); // 检查是否正确获取到元素的滚动高度
            showFadeEffect = shareMessagesShow.scrollHeight > 1000;
        }
    }
    onMount(async () => {
        isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent,
            );
        for (let i = 0; i < shareIndexs.length; i++) {
            shareMessages.push(get(current_chat)[shareIndexs[i]]);
        }
        isReady = true;

        //绘制二维码
        drawQRCode(
            "/uugpt_favion-48.png",
            240,
            32,
            document.createElement("canvas"),
            shareUrl,
        ).then((res) => {
            qrcodeUrl = res;
            checkHeight();
            setTimeout(async () => {
                imageUrl = await convertToImage(shareImageOriginal);
            }, 500);
        });
    });

    afterUpdate(() => {
        // checkHeight();
        // drawQRCode("/uugpt_favion-48.png", 96, 16, qrCanvas, shareUrl);
    });
</script>

<div
    class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === "Enter" && closeModal()}
    on:click={closeModal}
>
    <div
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === "Enter"}
        class="bg-white sm:rounded-lg shadow-lg relative max-w-[640px] w-full mx-0 sm:mx-5 flex flex-col justify-between max-h-full sm:max-h-shareModel"
        on:click|stopPropagation
    >
        <!-- 标题和关闭按钮 -->
        <div class="flex justify-between items-center py-2 px-4">
            <h2 class="text font-bold mt-3 mb-3">
                {$t("app.shareMessagesPreview", {
                    default: "Sharing Image Preview",
                })}
            </h2>
            <button
                class="p-2 rounded hover:bg-gray-100"
                on:click={closeModal}
                aria-label="Close"
            >
                <img class="icon-white w-6" alt="Close" src={CloseIcon} />
            </button>
        </div>

        <!-- 消息展示区 -->
        <div
            bind:this={shareImageOriginal}
            class="share-image-canvas mx-4 overflow-y-auto flex-1 bg-white border-8 border-gray-200 rounded-xl"
            style="max-height: calc(100% - 100px);"
        >
            <div class="flex flex-col items-start p-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold">
                    {$t("app.shareMessagesTitle", { default: "Sharing" })}
                </h2>
                <div class="text-sm text-gray-600 mt-1">
                    {$t("app.shareMessagesLabel", {
                        default: "uuGPT - Multi-Model AI Assistant",
                    })} - {currentTime}
                </div>
            </div>

            <div
                class="share-messages-show max-h-[1000px] overflow-y-auto relative"
                bind:this={shareMessagesShow}
            >
                {#if isReady}
                    {#each shareMessages as message}
                        <ShareChatMessage {message} />
                    {/each}
                {/if}
                <!-- 渐隐效果 -->
                {#if showFadeEffect}
                    <div
                        class="absolute bottom-0 left-0 w-full h-12 pointer-events-none flex items-center justify-center"
                        style="background: linear-gradient(to top, white 50%, rgba(255, 255, 255, 0) 100%);"
                    >
                        <span class="text-sm text-gray-500">
                            {$t("app.viewMoreOnWebsite", {
                                default:
                                    "Open the link to view the full content.",
                            })}
                        </span>
                    </div>
                {/if}
            </div>

            <!-- 网站图标、说明、二维码 -->
            <div
                class="m-6 flex flex-row justify-center items-center p-0 rounded-xl sm:justify-between sm:p-5 sm:bg-gray-100"
            >
                <!-- 网站图标和说明 -->
                <div class="items-start gap-4 hidden sm:flex flex-col">
                    <img src={UUGPTIcon} alt="Website Icon" class="w-16 h-16 items-start" />
                    <div class="flex items-start flex-col gap-1">
                        <span
                            class="text-bold text-gray-900 flex flex-row items-center"
                        >
                            <span class="text-bold"
                                >{$t("app.appname", { default: "uuGPT" })}</span
                            >

                            <span class="text-sm text-gray-600 hidden sm:flex">
                                {$t("app.websiteDescription", {
                                    default: " - Multi-Model AI Assistant",
                                })}
                            </span>
                        </span>
                        <!-- 长按识别提示 -->
                        <p class="text-sm text-gray-600 hidden sm:flex">
                            {$t("app.scanQRCode", {
                                default:
                                    "Long press or scan the QR code and continue in uuGPT.",
                            })}
                        </p>
                    </div>
                </div>

                <!-- 二维码 -->

                {#if qrcodeUrl}
                    <img
                        class="w-40 h-40 aspect-square"
                        alt="qrcode"
                        src={qrcodeUrl}
                    />
                {/if}
            </div>
        </div>
        <!-- 底部按钮 -->
        <div class="p-4 px-6 flex  gap-4 {isMobile ?'justify-end':'justify-between'}">
            <div class="gap-4 items-center text-xs {isMobile ? 'hidden':'flex'}">
                <span>{$t("app.sharetoText", { default: "Share to:" })}</span>
                <button class="rounded text-xs" on:click={shareToWeChat}>
                    <img
                        src={WeChatIcon}
                        alt={$t("app.shareWeChat", {
                            default: "Share to Wechat",
                        })}
                        class="w-6 h-6 inline"
                    />
                </button>
                <button class="rounded text-xs" on:click={shareToX}>
                    <img
                        src={XIcon}
                        alt={$t("app.shareX", { default: "Share to X" })}
                        class="w-6 h-6 inline"
                    />
                </button>
            </div>

            <div>
                <button
                    class="bg-themegreen text-white px-3 py-2 rounded hover:bg-themegreenhover text-xs
                    {isMobile? 'hidden':''}"
                    on:click={copyImageToClipboard}
                >
                    {$t("app.copyImage", { default: "Copy Img" })}
                </button>
                <button
                    class="px-3 py-2 rounded
                    {isMobile? 'bg-transparent border border-themegreen text-themegreen hover:bg-gray-100':'bg-themegreen text-white hover:bg-themegreenhover text-xs'}"
                    on:click={downloadImage}
                >
                    {$t("app.downloadImage", { default: "Download Img" })}
                </button>
                {#if isMobile}
                    <button
                        class="bg-themegreen text-white px-4 py-2 rounded hover:bg-themegreenhover"
                        on:click={mobileShare}
                    >
                        {$t("app.ShareStateTitle", { default: "Share" })}
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    /* 确保滚动平滑 */
    .overflow-y-auto {
        -webkit-overflow-scrolling: touch;
    }

    .share-messages-show {
        overflow-y: hidden;
        position: relative;
    }

    /* 确保渐隐元素在内容上方，但不影响滚动 */
    .share-messages-show > *:last-child {
        margin-top: -12px; /* 抵消渐隐高度，避免内容重叠 */
    }
</style>
