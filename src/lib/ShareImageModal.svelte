<script lang="ts">
    import { t } from "svelte-i18n";
    import { createEventDispatcher, onMount, afterUpdate } from "svelte"; // Import onMount and afterUpdate
    import SvelteMarkdown from "svelte-markdown";
    import ShareChatMessage from "./ShareChatMessage.svelte";

    import CloseIcon from "../assets/close.svg";
    import XIcon from "../assets/x.svg";
    import WeChatIcon from "../assets/wechat.svg";
    import UUGPTIcon from "../assets/uugpt_favion_small.png";

  
    export let isOpen = true;
    // export let messages: any[] = [];
    export let currentTime: string = new Date().toLocaleString();
    
    let shareMessagesShow: HTMLDivElement;
    let showFadeEffect = false;
  
    const dispatch = createEventDispatcher();
  
    function closeModal() {
      dispatch("close");
    }
  
    // 占位函数：生成图片（后续可替换为实际实现）
    function generateImage() {
      console.log("生成图片逻辑待实现");
    }
  
    // 占位函数：下载图片
    function downloadImage() {
      console.log("下载图片逻辑待实现");
    }
  
    // 占位函数：分享到微信
    function shareToWeChat() {
      console.log("分享到微信逻辑待实现");
    }
  
    // 占位函数：分享到 X
    function shareToX() {
      console.log("分享到 X 逻辑待实现");
    }

    // 检查内容高度并更新渐隐效果
    function checkHeight() {
        if (shareMessagesShow) {
        showFadeEffect = shareMessagesShow.scrollHeight > 1000;
        }
    }

    onMount(() => {
        checkHeight();
    });

    afterUpdate(() => {
        checkHeight();
    });

      // 假数据测试
  const shareMessages = [
  {
    mid: "msg1",
    message: {
      role: "user",
      content: "你好！请告诉我今天的天气怎么样？"
    },
    selected: true
  },
  {
    mid: "msg2",
    message: {
      role: "assistant",
      content: `
# 今天的天气预报

你好！今天是 **2025年5月26日，早上10:19 PDT**，天气情况如下：

- **温度**：20°C，感觉舒适
- **天气**：晴朗，阳光明媚
- **风速**：5 km/h，微风
- **建议**：适合户外活动，记得涂防晒霜！

以下是一个简单的 Python 脚本，获取天气数据（示例）：

\`\`\`python
import requests

def get_weather(city):
    url = f"https://api.weather.com/v1/{city}"
    response = requests.get(url)
    data = response.json()
    return data["temperature"]

print(get_weather("San Francisco"))
\`\`\`

如果需要更多细节，请告诉我！
      `
    },
    selected: true
  },
  {
    mid: "msg3",
    message: {
      role: "user",
      content: "那明天的天气预报是什么样的？可以给一些穿衣建议吗？"
    },
    selected: true
  },
  {
    mid: "msg4",
    message: {
      role: "assistant",
      content: `
## 明天的天气预报

明天（2025年5月27日）的天气如下：

### 基本信息
- **温度**：18°C - 22°C
- **天气**：多云转小雨
- **湿度**：70%

### 穿衣建议
1. **上衣**：穿长袖衬衫或薄毛衣，应对早晚温差。
2. **外套**：带一件轻便雨衣或防水外套。
3. **其他**：建议携带雨伞，避免淋湿。

#### 小贴士
如果有户外活动，建议安排在上午，下午可能有阵雨。
      `
    },
    selected: true
  }
];
    
  </script>
  
  {#if isOpen}
    <div
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      on:click={closeModal}
    >
        <div
            class="bg-white rounded-lg shadow-lg relative max-w-[720px] w-full mx-5 flex flex-col justify-between"
            style="height: calc(100vh - clamp(24px, 10vh, 72px) * 2);"
            on:click|stopPropagation
        >
            <!-- 标题和关闭按钮 -->
            <div class="flex justify-between items-center py-2 px-4">
                <h2 class="text font-bold mt-3 mb-3">
                    {$t("app.shareMessagesPreview", { default: "分享对话预览" })}
                </h2>
            <button
                class="text-gray-500 hover:text-gray-700"
                on:click={closeModal}
                aria-label="Close"
            >
                <img class="icon-white w-6" alt="Close" src={CloseIcon} />
            </button>
            </div>
    
            <!-- 消息展示区 -->
            <div class="share-image-canvas mx-4 overflow-y-auto flex-1 bg-white border-8 border-gray-200 rounded-xl" style="max-height: calc(100% - 100px);">
                <div class="flex flex-col items-start p-4 border-b border-gray-200">
                        <h2 class="text-lg font-semibold">{$t("app.shareMessagesTitle", { default: "对话分享" })}</h2>
                        <div class="text-sm text-gray-600 mt-1">
                            {$t("app.shareMessagesLabel", { default: "uuGPT-让多模型AI对话更高效" })} - {currentTime}
                        </div>
                </div>
                
                <div
                class="share-messages-show max-h-[1000px] overflow-y-auto relative"
                bind:this={shareMessagesShow}
                >
                    <!-- 在这里插入分享消息内容，暂时是假数据 -->
                    {#each shareMessages as message}
                        <ShareChatMessage message={message}/>
                    {/each}
                    <!-- 渐隐效果 -->
                    {#if showFadeEffect}
                        <div
                        class="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white via-white to-transparent pointer-events-none flex items-end justify-center"
                        >
                        <span class="text-sm text-gray-500">
                            {$t("app.viewMoreOnWebsite", { default: "Open the link to view the full content." })}
                        </span>
                        </div>
                    {/if}
                </div>
                
                <div class="fade-out-mask"></div>
                <!-- 网站图标、说明、二维码 -->
                <div class="m-6 flex flex-row justify-between items-center p-5 bg-gray-100 rounded-xl">
                    <!-- 网站图标和说明 -->
                    <div class="flex items-center gap-4">
                        <img
                            src={UUGPTIcon}
                            alt="Website Icon"
                            class="w-12 h-12"
                        />
                        <div class="flex items-start flex flex-col">
                            <span class="text-bold text-gray-900">
                                {$t("app.websiteDescription", { default: "uuGPT - Multi-Model AI Assistant" })}
                            </span>
                            <!-- 长按识别提示 -->
                            <p class="text-sm text-gray-600">
                                {$t("app.scanQRCode", { default: "Long press or scan the QR code and continue in uuGPT." })}
                            </p>
                        </div>
                    </div>
                    
        
                    <!-- 二维码 -->
                    <div>                    
                        <img src="./src/assets/qrcode.png" alt="QR Code" class="w-24 h-24 aspect-square object-contain"/>
                    </div>
                </div>
            </div>

            <!-- 底部按钮 -->
            <div class="p-4 px-6 flex justify-between gap-4">
                <div class="flex gap-4 items-center text-xs">
                    <span>{$t("app.sharetoText", { default: "Share to:" })}</span>
                    <button
                        class="rounded text-xs"
                        on:click={shareToWeChat}
                    >
                        <img src={WeChatIcon} alt={$t("app.shareWeChat", { default: "Share to Wechat" })} class="w-6 h-6 inline" />
                    
                    </button>
                    <button
                        class="rounded text-xs"
                        on:click={shareToX}
                    >
                        <img src={XIcon} alt={$t("app.shareX", { default: "Share to X" })} class="w-6 h-6 inline" />
                    </button>
                </div>

                <div>
                    <button
                        class="bg-themegreen text-white px-3 py-2 rounded hover:bg-themegreenhover text-xs"
                        on:click={generateImage}
                    >
                        {$t("app.copyImage", { default: "Copy Img" })}
                    </button>
                    <button
                        class="bg-themegreen text-white px-3 py-2 rounded hover:bg-themegreenhover text-xs"
                        on:click={downloadImage}
                    >
                        {$t("app.downloadImage", { default: "Download Img" })}
                    </button>
                </div>
            </div>
        </div>
    </div>
  {/if}
  
  <style>
    /* 确保滚动平滑 */
    .overflow-y-auto {
      -webkit-overflow-scrolling: touch;
    }

    .share-messages-show{
        overflow-y:hidden; 
        position: relative;
    }

    /* 确保渐隐元素在内容上方，但不影响滚动 */
    .share-messages-show > *:last-child {
        margin-top: -12px; /* 抵消渐隐高度，避免内容重叠 */
    }
  </style>