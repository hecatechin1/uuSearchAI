<script lang="ts">
    import SiderBar from "$lib/SiderBar.svelte";

    import ChatMain from '$lib/ChatMain.svelte';
    import Topbar from "$lib/Topbar.svelte";
    import SearchChat from "$lib/SearchChat.svelte";
    import { onMount } from 'svelte';
    import "../../i18n.js";
    import {initializeI18n} from "../../i18n";
    import {waitLocale} from "svelte-i18n";
    import AiModelSelector from "$lib/AIModelSelector.svelte";
    import {clickOutside} from '../../utils/generalUtils.js';

    // 状态管理
    let selectedChatId = "1";
    let isReady = false;
    let showSelector = false;
    let selectorTop:number;
    let selectorLeft:number;
    let callback:Function;// 选择模型的回调函数
    function changeChat(event:CustomEvent){
      
    }

    
    onMount(async ()=>{
      await initializeI18n();
      await waitLocale();
      isReady = true;
    });

    function showModelSelector(event:CustomEvent){
      selectorTop = event.detail.top;
      selectorLeft = event.detail.left;
      callback = event.detail.callback;
      showSelector = !showSelector;

    }

    function hideSelector(){
      showSelector = false;
    }

    function aiModelSelected(event:CustomEvent){
      hideSelector();
      console.log(event.detail);
      callback(event.detail.ai,event.detail.model);
    }
  </script>
    {#if isReady}
    <div class="relative flex h-full overflow-hidden">
        <!-- 侧边栏 -->
        <SiderBar on:selectChat={changeChat} />
        <!-- 聊天主界面 -->
        <div class="flex-1 relative ">
          <Topbar on:show-selector={showModelSelector}/>
          <ChatMain  selectedChatId={selectedChatId} on:show-selector={showModelSelector}/>
        </div>
        <!-- AI选择器需要JS计算位置，主要是左上角坐标。元件宽度260px，高度310px，注意边缘计算 -->
         {#if showSelector}
         <div use:clickOutside={hideSelector}>
          <AiModelSelector on:aiModelSelected={aiModelSelected}  top={selectorTop}  left={selectorLeft}  />
        </div>
        {/if}
    </div>
    {/if}

  <style>
     :global(html, body) {
      height: 100%;
    }
  </style>