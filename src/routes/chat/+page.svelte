<script lang="ts">
    import SiderBar from "$lib/SiderBar.svelte";
    import ChatMain from '$lib/ChatMain.svelte';
    import Topbar from "$lib/Topbar.svelte";
    import SearchChat from "$lib/SearchChat.svelte";
    import { onMount } from 'svelte';
    import "../../i18n.js";
    import {initializeI18n} from "../../i18n";
    import {waitLocale} from "svelte-i18n";
    // 状态管理
    let selectedChatId = "1";
    let isReady = false;
    
    function changeChat(event:CustomEvent){
      console.log(event.detail.text);

    }
    onMount(async ()=>{
      await initializeI18n();
      await waitLocale();
      isReady = true;
    });
  </script>
    {#if isReady}
    <div class="flex h-screen overflow-hidden">
        
      
        <!-- 侧边栏 -->
        <SiderBar on:selectChat={changeChat} />
        <!-- 聊天主界面 -->
        <div class="flex-1 relative ">
          <Topbar/>
          <ChatMain selectedChatId={selectedChatId} />
        </div>
        
        
        
    </div>
    {/if}

  <style>

  </style>