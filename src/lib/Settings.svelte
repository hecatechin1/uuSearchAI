<script lang="ts">
  import { t, locale} from "svelte-i18n";
  import { createEventDispatcher } from "svelte";
  import CloseIcon from "../assets/close.svg";
  import { writable, get, derived } from "svelte/store";
  import { onMount } from "svelte";

  import { settingsVisible, sendKey, lineBreakKey } from "../stores/stores";

  const keys = ["Enter", "Shift+Enter", "Ctrl+Enter"];
  const dispatch = createEventDispatcher();
  // 切换语言
  function changeLanguage(event: any) {
    locale.set(event.target.value);
    handleSave();
    // console.log(get(locale));
  }

  function handleSave() {
    dispatch("settings-changed");
    //保存设置
  }

  function changeSendKey(event: any) {
    if (get(sendKey) != event.target.value) {
      sendKey.set(event.target.value);
      handleSave();
    }
  }

  function changeBreakLineKey(event: any) {
    if (get(lineBreakKey) != event.target.value) {
      lineBreakKey.set(event.target.value);
      handleSave();
    }
  }

  function handleClose() {
    //关闭设置弹窗
    settingsVisible.set(false);
  }

  function handleSaveAndClose() {
    handleSave();
    handleClose();
  }
</script>

<!-- Settings.svelte -->
<div class="fixed z-50 inset-0 animate-fade-in">
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="w-full sm:w-auto bg-primary text-gray-900 rounded-xl shadow-2xl py-8 relative max-h-[90vh] outline outline-[0.5px] outline-gray-300
                max-w-[100vw] md:w-[40rem] md:max-w-[40rem] md:min-w-[40rem] 
                max-sm:w-screen max-sm:h-screen max-sm:max-h-none rounded-none max-sm:shadow-none max-sm:outline-none max-sm:rounded-none"
    >
      <button
        class="absolute top-2 right-2 mt-2 mr-2 text-gray-500 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors duration-200 p-1
                    max-sm:top-0 max-sm:right-0 max-sm:mt-1 max-sm:mr-1 max-sm:p-2"
        on:click={handleSaveAndClose}
      >
        <img class="icon-white w-6" alt="Close" src={CloseIcon} />
      </button>
      <h2 class="text-xl font-bold mb-4 px-4 sm:px-8 mt-3 mb-3">
        {$t("settings.title")}
      </h2>
      <!-- Language Selection -->

      <div class="setting-items">
        <div class="setting-item-group">
          <div class="setting-item">
            <span class="setting-lable">{$t("settings.language")}</span>
            <select class="" on:change={changeLanguage} bind:value={$locale}>
              <option value="zh">中文 (Chinese)</option>
              <option value="en">English (English)</option>
              <option value="es">Español (Spanish)</option>
              <option value="fr">Français (French)</option>
              <option value="de">Deutsch (German)</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="ko">한국어 (Korean)</option>
              <option value="ru">Русский (Russian)</option>
              <option value="pt">Português (Portuguese)</option>
              <option value="it">Italiano (Italian)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="tr">Türkçe (Turkish)</option>
              <option value="vi">Tiếng Việt (Vietnamese)</option>
              <option value="th">ไทย (Thai)</option>
              <option value="pl">Polski (Polish)</option>
              <option value="nl">Nederlands (Dutch)</option>
              <option value="sv">Svenska (Swedish)</option>
              <option value="fi">Suomi (Finnish)</option>
              <option value="no">Norsk (Norwegian)</option>
              <option value="da">Dansk (Danish)</option>
            </select>
          </div>
        </div>

        <!-- 模型和询问方式设置组 暂时不上-->
        <!-- <div class="setting-item-group">
          
          <div class="setting-item">
            <span class="setting-lable">{$t('settings.whenask.title')}</span>
            <select class="">
              <option>{$t('settings.whenask.afterQmark')}</option>
              <option>{$t('settings.whenask.askMannually')}</option>
              <option>{$t('settings.whenask.askAnytime')}</option>
            </select>
          </div>

          <div class="setting-item">
            <span class="setting-lable">{$t('settings.mode')}</span>
            <select class="">
              <option>GPT-4.0</option>
              <option>mode2</option>
              <option>mode3</option>
              <option>mode4</option>
            </select>
          </div>

        </div> -->

        <!-- Second Section 快捷键设置组-->
        {#if !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)}
          <div class="setting-item-group">
            <div class="setting-item">
              <span class="setting-lable">{$t("settings.sendKey")}</span>
              <select class="" on:change={changeSendKey}>
                {#each keys as k}
                  {#if k != $lineBreakKey}
                    {#if k == $sendKey}
                      <option class="text-gray-600" selected>{k}</option>
                    {:else}
                      <option class="text-gray-600">{k}</option>
                    {/if}
                  {/if}
                {/each}
              </select>
            </div>
            <div class="setting-item">
              <span class="setting-lable">{$t("settings.lineBreakKey")}</span>
              <select class="" on:change={changeBreakLineKey}>
                {#each keys as k}
                  {#if k != $sendKey}
                    {#if k == $lineBreakKey}
                      <option class="text-gray-600" selected>{k}</option>
                    {:else}
                      <option class="text-gray-600">{k}</option>
                    {/if}
                  {/if}
                {/each}
              </select>
            </div>

            <!-- <div class="setting-item">
            <span class="setting-lable">{$t('settings.switchMode')}</span>
            <select class="">
              <option class="text-gray-600">Ctrl + Shift + M</option>
              <option class="text-gray-600">{$t('settings.customKey')}</option>
            </select>
          </div>
          <div class="setting-item">
            <span class="setting-lable">{$t('settings.newChat')}</span>
            <select class="">
              <option class="text-gray-600">Ctrl + Shift + N</option>
              <option class="text-gray-600">{$t('settings.customKey')}</option>
            </select>
          </div> -->
          </div>
        {/if}
        <!-- Third Section  版本和服务支持-->
        <div class="setting-item-group">
          <div class="setting-item">
            <span class="setting-lable">{$t("settings.currentV")}</span>
            <span class="text-gray-600">Version 1.0.0</span>
          </div>
          <div class="setting-item">
            <span class="setting-lable">{$t("settings.termsText")}</span>
            <a
            target="_blank"
              href={$t("settings.termsLink")}
              class="text-gray-600 hover:underline break-all"
            >
              {$t("settings.termsLink")}
            </a>
          </div>
          <div class="setting-item">
            <span class="setting-lable">{$t("settings.userSupport")}</span>
            <a
            target="_blank"
              href={"mailto:" + $t("settings.userSupportEmail")}
              class="text-gray-600 hover:underline"
            >
              {$t("settings.userSupportEmail")}
            </a>
          </div>
        </div>
      </div>
      <div class="flex justify-end"></div>
    </div>
  </div>
</div>

<style>
  @import "../styles/settings.css";
</style>
