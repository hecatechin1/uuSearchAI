<script>
  import {  fade} from 'svelte/transition';
  import { onMount } from "svelte";
  import GPTIcon from "../assets/gpt.svg";
  import ClaudeIcon from "../assets/claude.svg";
  import GeminiIcon from "../assets/gemini.svg";

  let currentAi = "GPT"
  let currentModel = "4o-mini"

  let selectedAI = 'openai';
  let models = [
    {
      ai: 'openai',
      aiName: 'gpt',
      models: [
        { name: 'gpt-4o', price: '' },
        { name: 'gpt-4o-mini', price: '免费' },
        { name: 'gpt-4-turbo', price: '' },
        { name: 'gpt-4', price: '' },
        { name: 'gpt-3.5-turbo', price: '' }
      ]
    },
    {
      ai: 'anthropic',
      aiName: 'claude',
      models: [
        { name: 'claude-3-5-sonnet-20241022', price: '' },
        { name: 'claude-3-5-haiku-20241022', price: '' },
        { name: 'claude-3-opus-20240229', price: '' },
        { name: 'claude-3-sonnet-20240229', price: '' },
        { name: 'claude-3-haiku-20240307', price: '' }
      ]
    },
    {
      ai: 'google',
      aiName: 'gemini',
      models: [
        { name: 'models/gemini-1-0-pro', price: '' },
        { name: 'models/gemini-1-0-pro-vision', price: '' },
        { name: 'models/gemini-1-5-flash', price: '' },
        { name: 'models/gemini-1-5-pro', price: '' }
      ]
    }
  ];

  let openSubMenu = null;

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function toggleSubMenu(ai) {
    openSubMenu = openSubMenu === ai ? null : ai;
  }

  onMount(() => {
    // Initialize selected model
    selectedAI = models[0].ai;
  });
</script>
    
<!-- transition:fade={{ duration: 300 }} -->
  <div class="relative">
    <div
      class="absolute top-full py-2 left-0 w-[250px] bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-50 max-h-[300px] overflow-y-auto dropdown-menu"
     
    >
      {#each models as { ai, aiName, models: aiModels }}
        <div class="py-2">
          <div class="font-semibold text-themegreen px-4 flex justify-between items-center cursor-pointer" on:click={() => toggleSubMenu(ai)}>
            <div class="flex items-center space-x-2">
              <img 
                src={ai === 'openai' ? GPTIcon : ai === 'anthropic' ? ClaudeIcon : GeminiIcon} 
                alt={ai} class="w-6 h-6" />
              <span>{aiName}</span>
            </div>
            <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path d={openSubMenu === ai ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
            </svg>
          </div>

          <!-- Submenu -->
          {#if openSubMenu === ai}
            <div
              class="pl-4 mt-2"
              transition:fade={{ duration: 300 }}
            >
              {#each aiModels as { name, price }}
                <button
                  on:click={() => selectedAI = name}
                  class="flex justify-between items-center px-4 py-2 w-full text-left hover:bg-gray-100"
                >
                  <div class="flex items-center space-x-2">
                    <span>{name}</span>
                  </div>
                  <span class="text-sm text-gray-500">{price}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

<style>
  .dropdown-menu {
    overflow-y: auto;
    scrollbar-gutter: stable; /* 确保显示滚动条时宽度不会变化 */
  }

  /* 自定义滚动条 */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-track {
    background-color: #f5f5f5;
  }
</style>
