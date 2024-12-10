<script>
    import { fade } from 'svelte/transition';
    import { onMount } from "svelte";
    import { t } from 'svelte-i18n';
    
    import editIcon from '../assets/edit.svg'
    import deleteIcon from '../assets/delete.svg'

</script>

<div
    class="z-50 absolute top-full py-2 left-0 max-w-[250px] bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 max-h-[300px] overflow-y-auto dropdown-menu"
    transition:fade={{ duration: 300 }}
>

  <div class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-token-text-secondary h-5 w-5">
        <img src={editIcon} alt="Rename chat"/>
    </div>
    <span class="whitespace-nowrap">{$t("app.rename")}</span>
  </div>

  <div class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-token-text-secondary h-5 w-5">
        <img src={deleteIcon} alt="Delete chat" class="ml-[-2px]"/>
    </div>
    <span class="whitespace-nowrap">{$t("app.delete")}</span>
  </div>
</div>