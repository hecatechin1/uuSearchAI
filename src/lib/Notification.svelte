<script>
  import closeIcon from "../assets/login/close.svg";
  import { t } from "svelte-i18n"; // 导入本地化方法
  import {createEventDispatcher } from "svelte";

  export let content;
  export let show_close= false;
  export let show_confirm = false;
  // 确认和取消按钮文案
  export let title = $t("window.notice");
  export let confirmText = $t("window.confirm");
  export let cancelText = $t("window.cancel");
  let dispatch = createEventDispatcher();

  // 控制弹窗的显示和隐藏
  let isVisible = true;

  // 关闭弹窗
  function closeModal() {
    isVisible = false;
    dispatch("close");
    dispatch("confirm");
  }

</script>

{#if isVisible}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div
      class="bg-white p-6 md:p-10 rounded-lg shadow-md w-full h-screen md:w-auto md:min-w-[32rem] md:max-h-[32rem] relative"
    >
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-bold">{title}</h2>
        <button class="text-2xl font-bold" on:click={closeModal}>
          <img src={closeIcon} alt="Close" class="w-8 h-8" />
        </button>
      </div>
      <div class="mt-4">
        <p>{content}</p>
      </div>
      <div class="mt-6 flex justify-end space-x-4">
        {#if show_confirm}
          <button
            class="bg-blue-500 text-white px-4 py-2 rounded"
            on:click={closeModal}>{confirmText}</button
          >
        {/if}
        {#if show_close}
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded"
            on:click={closeModal}>{cancelText}</button
          >
        {/if}
      </div>
    </div>
  </div>
{/if}
