<script lang="ts">
  import { t } from "svelte-i18n";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import {
    current_chat_ainame,
    current_chat_modelname,
    models,
  } from "../stores/chatStores";
  import { changeChatModel, createNewChat } from "../manages/chatManages";
  import { getElementPostionDiff } from "../utils/generalUtils";
  import { get } from "svelte/store";
  import { showSidebar, showSidebarMd } from "../stores/globalParamentStores";

  const dispatch = createEventDispatcher();
  let showModelSelectorbtn: HTMLElement;
  function showModelSelector() {
    let position = getElementPostionDiff(showModelSelectorbtn);
    dispatch("show-selector", {
      originElement:showModelSelectorbtn,
      position: position,
      callback: selectedCallback,
    });
  }
  function selectedCallback(ai: string, model: string) {
    changeChatModel(ai, model);
  }
</script>

<div
  class="draggable sticky top-0 z-10 flex min-h-[44px] items-center justify-center border-transparent bg-white pl-0 md:hidden"
>
  <div
    class="no-draggable absolute bottom-0 left-0 top-0 ml-3 inline-flex items-center justify-center"
  >
    <button
      on:click={() => {
        showSidebarMd.update((v) => {
          return !v;
        });
      }}
      type="button"
      class="inline-flex rounded-md hover:bg-gray-200 focus:bg-gray-200 active:opacity-50 py-1.5"
      data-testid="open-sidebar-button"
      ><span class="sr-only">{$t("app.showSidebar")}</span><svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="icon-lg mx-2 text-themegreen"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z"
          fill="currentColor"
        >
        </path>
      </svg>
    </button>
  </div>
  <div class="no-draggable">
    <button
      on:click={showModelSelector}
      bind:this={showModelSelectorbtn}
      type="button"
      data-state="closed"
      class="group flex cursor-pointer items-center gap-1 rounded-lg py-1.5 px-3 hover:bg-gray-200 focused:bg-gray-200 font-semibold text-themegrey overflow-hidden whitespace-nowrap"
    >
      <div class="text-themegrey">
        {$current_chat_ainame}
        <span class="text-themegrey">{$current_chat_modelname}</span>
      </div>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="icon-md text-themegrey"
        ><path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M5.29289 9.29289C5.68342 8.90237 6.31658 8.90237 6.70711 9.29289L12 14.5858L17.2929 9.29289C17.6834 8.90237 18.3166 8.90237 18.7071 9.29289C19.0976 9.68342 19.0976 10.3166 18.7071 10.7071L12.7071 16.7071C12.5196 16.8946 12.2652 17 12 17C11.7348 17 11.4804 16.8946 11.2929 16.7071L5.29289 10.7071C4.90237 10.3166 4.90237 9.68342 5.29289 9.29289Z"
          fill="currentColor"
        >
        </path>
      </svg>
    </button>
  </div>
  <div
    class="no-draggable absolute bottom-0 right-0 top-0 mr-3 inline-flex items-center justify-center"
  >
    <span class="flex" data-state="closed">
      <button
        on:click={() => {
          createNewChat(true);
        }}
        aria-label={$t("app.newChat")}
        class="h-10 rounded-lg px-2 text-themegreen disabled:opacity-50 enabled:hover:bg-gray-200"
        ><svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          fill="currentColor"
        >
          <path
            id="svg_1"
            d="m12.55289,1.06482l0.6064,0.00199c5.27267,0.29028 9.48364,4.50125 9.77591,9.82859l0,0.55172a10.24412,10.24412 0 0 1 -1.09947,4.64241a10.38131,10.38131 0 0 1 -13.25324,4.95058l-0.29425,-0.12824l-5.91485,1.97228a0.99409,0.99409 0 0 1 -1.28636,-1.15215l0.02982,-0.10537l1.97029,-5.91584l-0.12724,-0.29326a10.2481,10.2481 0 0 1 -0.78533,-3.59861l-0.00497,-0.37179a10.38131,10.38131 0 0 1 5.73691,-9.28184a10.24909,10.24909 0 0 1 4.64639,-1.10046zm0.55172,1.98818l-0.5547,0a8.26687,8.26687 0 0 0 -3.75071,0.88971a8.39511,8.39511 0 0 0 -4.64142,7.50739c-0.00298,1.30226 0.30121,2.58464 0.88772,3.74673a0.99409,0.99409 0 0 1 0.05567,0.76247l-1.47126,4.40979l4.41079,-1.47026a0.99409,0.99409 0 0 1 0.64119,0.00497l0.12128,0.0507c1.16209,0.58651 2.44547,0.89071 3.74872,0.88772a8.39611,8.39611 0 0 0 7.50739,-4.64539c0.58651,-1.1611 0.89071,-2.44547 0.88772,-3.74673l0.00199,-0.50003c-0.2356,-4.26068 -3.63838,-7.66346 -7.84339,-7.89707l-0.00099,0zm-0.60739,3.97637a0.99409,0.99409 0 0 1 0.99409,0.99409l0,2.48523l2.48523,0a0.99409,0.99409 0 0 1 0,1.98818l-2.48523,0l0,2.48523a0.99409,0.99409 0 0 1 -1.98818,0l0,-2.48523l-2.48523,0a0.99409,0.99409 0 0 1 0,-1.98818l2.48523,0l0,-2.48523a0.99409,0.99409 0 0 1 0.99409,-0.99409z"
            fill="currentColor"
          />
        </svg></button
      ></span
    >
  </div>
</div>
