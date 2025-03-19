<script lang="ts">
  import { fade } from "svelte/transition";
  import {createEventDispatcher } from "svelte";
  import GPTIcon from "../assets/gpt.svg";
  import ClaudeIcon from "../assets/claude.svg";
  import GeminiIcon from "../assets/gemini.svg";
  import DeepseekIcon from "../assets/deepseek.svg";
  import QwenIcon from "../assets/qwen.svg";
  import { models } from "../stores/chatStores";
  export let top = 0;
  export let left = 0;
  export let right = 0;
  export let bottom = 0;

  let dispatch = createEventDispatcher();

  let aiImg = {
    openai: GPTIcon,
    anthropic: ClaudeIcon,
    google: GeminiIcon,
    deepseek: DeepseekIcon,
    qwen: QwenIcon,
  };
  let openSubMenu: string = "";

  function toggleDropdown() {}

  function toggleSubMenu(ai: string) {
    openSubMenu = openSubMenu === ai ? "" : ai;
  }

  function selectedModel(ai: string, model: string) {
    dispatch("aiModelSelected", { ai: ai, model: model });
  }

</script>

<!-- transition:fade={{ duration: 300 }} -->
<div
  class="fixed z-50"
  style="position: fixed;"
  style:left={left > 0 ? `${left}px` : undefined}
  style:top={top > 0 ? `${top}px` : undefined}
  style:right={right > 0 ? `${right}px` : undefined}
  style:bottom={bottom > 0 ? `${bottom}px` : undefined}
>
  <div class="relative">
    <div
      class=" top-full py-2 left-0 w-[250px] bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-50 max-h-[300px] overflow-y-auto dropdown-menu"
    >
      {#each models as { ai, aiName, models: aiModels }, ai_index}
        <div class="py-2">
          <button on:click={() => toggleSubMenu(ai)}>
            <div
              class="font-semibold text-themegreen px-4 flex justify-between items-center cursor-pointer"
            >
              <div class="flex items-center space-x-2">
                <img src={aiImg[ai]} alt={ai} class="w-6 h-6" />
                <span>{aiName}</span>
              </div>
              <svg
                class="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d={openSubMenu === ai ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
                />
              </svg>
            </div>
          </button>

          <!-- Submenu -->
          {#if openSubMenu === ai}
            <div class="pl-4 mt-2" transition:fade={{ duration: 300 }}>
              {#each aiModels as { name, price, model }, model_index}
                <button
                  on:click={() => selectedModel(ai, model)}
                  class="flex justify-between items-center px-4 py-2 w-full text-left hover:bg-gray-100"
                >
                  <div class="flex items-center space-x-2">
                    <span>{aiName} {name}</span>
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
