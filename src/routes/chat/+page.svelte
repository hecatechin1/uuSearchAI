<script lang="ts">
    import ChatSidebar from '../../lib/ChatSidebar.svelte';
    import ChatMain from '../../lib/ChatMain.svelte';
  
    // 状态管理
    let selectedChatId = null;
  
    const handleChatSelection = (chatId) => {
      selectedChatId = chatId;
    };
  </script>
  
    <div class="flex h-screen">
        <!-- 侧边栏 -->
        <ChatSidebar on:selectChat={handleChatSelection} />
      
        <!-- 聊天主界面 -->
        <ChatMain selectedChatId={selectedChatId} />
    </div> 