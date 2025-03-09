<script>
    import { fade } from 'svelte/transition';
    import { onMount ,createEventDispatcher} from "svelte";
    import { t } from 'svelte-i18n';
    import deleteAllIcon from '../assets/delete.svg'
    import deleteIcon from '../assets/delete2.svg'
    import {showSuccessMessage,showErrorMessage} from "../stores/globalParamentStores"
    import { renameChat,deleteChatData} from '../manages/chatManages';
    export let left = 0;
    export let right = 0;
    export let top = 0;
    export let bottom = 0;
    export let index = 0;
    let dispatch = createEventDispatcher();
    function deleteThisMessage(){
        dispatch('deleteThisMessage');
    }

    function deleteToEnd(){
        dispatch('deleteToTheEnd');
    }
</script>

<div
    class="z-50 absolute  py-2 max-w-[250px] bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 max-h-[300px] overflow-y-auto dropdown-menu"
   style="position: fixed;"
    style:left={left > 0 ? `${left}px` : undefined}
   style:top={top>0 ? `${top}px`:undefined}
   style:right={right>0?`${right}px`:undefined}
   style:bottom={bottom>0?`${bottom}px`:undefined}
    transition:fade={{ duration: 300 }}
>

  <div on:click={deleteThisMessage} class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-token-text-secondary h-5 w-5 flex-shrink-0">
        <img src={deleteIcon} alt="Rename chat"/>
    </div>
    <span  class="whitespace-normal break-words hyphens-auto flex-1" style="word-break: break-word;">{$t("app.deleteThisMessage")}</span>
  </div>

  <div on:click={deleteToEnd} class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-token-text-secondary h-5 w-5 flex-shrink-0">
        <img src={deleteAllIcon} alt="Delete chat" class="ml-[-2px]"/>
    </div>
    <span  class="whitespace-normal break-words hyphens-auto flex-1" style="word-break: break-word;">{$t("app.deleteToTheEnd")}</span>
  </div>
</div>