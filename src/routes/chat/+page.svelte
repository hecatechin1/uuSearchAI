<script lang="ts">
    import ChatSidebar from '../../lib/ChatSidebar.svelte';
    import ChatMain from '../../lib/ChatMain.svelte';
    import { onMount } from 'svelte';
    import "../../i18n.js";
    import {initializeI18n} from "../../i18n";
    import {waitLocale} from "svelte-i18n";
    // 状态管理
    let selectedChatId = "1";
    let isReady = false;
    const handleChatSelection = (chatId: string) => {
      selectedChatId = chatId;
    };

    onMount(async ()=>{
      await initializeI18n();
      await waitLocale();
      isReady = true;
    });
  </script>
  
    <div class="flex h-screen">
      {#if isReady}
        <!-- 侧边栏 -->
        <ChatSidebar on:selectChat={handleChatSelection} />
        <!-- 聊天主界面 -->
        <ChatMain selectedChatId={selectedChatId} />
        {/if}
    </div> 