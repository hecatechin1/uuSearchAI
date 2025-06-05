<script lang="ts">
    import { t, locale } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";
    import CloseIcon from "../assets/close.svg";
    import { writable, get, derived } from "svelte/store";
    import { onMount } from "svelte";
    import {} from "../manages/userinfoManages";
    import { sendKey, lineBreakKey } from "../stores/settingsStores";
    import { language } from "../stores/userStores";
    import { UpdateUserData_Settings } from "../manages/userinfoManages";
    import { userEmail, userPlanMode, userAvatar,userPlanEndtime,used_FreeTokens,used_NormalTokens,used_ExpensiveTokens} from "../stores/userStores";
    import DefaultAvatar from "../assets/login/avatar-default.svg";
    import VipBasicIcon from "../assets/pricing/basic-icon.svg";
    import VipProIcon from "../assets/pricing/pro-icon.svg";
    import {TokenLimit} from "../stores/globalParamentStores";
    const keys = ["Enter", "Shift+Enter", "Ctrl+Enter"];
    let sendk:any;
    let breakk:any;
    let lang;
    let tokenLimit :any;
    let cheap = 0;
    let normal = 0;
    let expensive = 0;
    onMount(async () => {
        console.log(get(used_FreeTokens),get(used_ExpensiveTokens),get(used_NormalTokens));
        console.log(get(TokenLimit));
        getLimit();
        cheap = tokenLimit.cheap.tokens - get(used_FreeTokens);
        if(tokenLimit.normal){
            normal = tokenLimit.normal.tokens - get(used_NormalTokens);
        };
        if(tokenLimit.expensive){
            expensive = tokenLimit.expensive.tokens - get(used_ExpensiveTokens);
        };
        cheap = cheap.toLocaleString('en-US');
        normal = normal.toLocaleString('en-US');
        expensive = expensive.toLocaleString('en-US');
        sendKey.subscribe((value) => {
            sendk = value;
        });

        lineBreakKey.subscribe((value) => {
            breakk = value; 
        })
        language.subscribe((value) => {
            lang = value; 
        })
    });
    const dispatch = createEventDispatcher();
    // 切换语言
    function changeLanguage(event: any) {
        locale.set(event.target.value);
        language.set(event.target.value);
        // handleSave();
        // console.log(get(locale));
    }

    function handleSave() {
        dispatch("settings-changed");
        //保存设置
    }

    function changeSendKey(event: any) {
        if (get(sendKey) != event.target.value) {
            sendKey.set(event.target.value);
            // handleSave();
        }
    }

    function changeBreakLineKey(event: any) {
        if (get(lineBreakKey) != event.target.value) {
            lineBreakKey.set(event.target.value);
            // handleSave();
        }
    }

    function handleClose() {
        UpdateUserData_Settings(get(sendKey), get(lineBreakKey), get(language));
        //关闭设置弹窗
        dispatch("close-settings");
    }

    function handleSaveAndClose() {
        handleSave();
        handleClose();
    }

    function getLimit(){
        let plan = get(userPlanMode);
        let limit = JSON.parse(get(TokenLimit));
        if(plan.includes("free")){
            tokenLimit = limit.free;
            return;            
        }
        if(plan.includes("basic")){
            tokenLimit = limit.basic;
        }
        if(plan.includes("pro")){
            tokenLimit = limit.pro;
        }
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
                        <div class="flex items-center space-x-3">
                            <img 
                                src={$userAvatar || DefaultAvatar} 
                                class="w-8 h-8 rounded-full object-cover"
                                alt="User Avatar"
                            />
                            <span class="setting-lable">
                                {#if $userEmail}
                                    {$userEmail}
                                {:else}
                                    {$t("app.guestUser", {default:"Guest"})}
                                {/if}
                            </span>
                        </div>
                        <span class="text-gray-600">
                            <a href="/pricing" target="_blank" class="hover:text-blue-600 hover:underline">
                            {#if $userPlanMode?.toLowerCase().includes('basic')}
                                    <img src={VipBasicIcon} class="w-5 h-5 mr-2 mb-1 inline" alt="" />{$t("pricing.basicPlanName")}
                            {:else if $userPlanMode?.toLowerCase().includes('pro')}
                            <img src={VipProIcon} class="w-5 h-5 mr-2 mb-1 inline" alt="" />{$t("pricing.proPlanName")} 
                            {:else}
                                {$t("pricing.freePlanName")}
                            {/if}
                            </a>
                        </span>
                    </div>
                    {#if $userPlanMode?.toLowerCase().includes('basic') || $userPlanMode?.toLowerCase().includes('pro')}
                        <div class="setting-item">
                            <span class="setting-lable">{$t("pricing.planEndTime",{default:"Expiration Date"})}</span>
                            <span class="text-gray-600">{new Date($userPlanEndtime * 1000).toLocaleDateString($locale, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                    {/if}
                    <div class="setting-item" style="align-items: start;">
                        <span class="setting-lable">{$t("app.tokensLeft",{default:"Tokens Left"})}</span>
                        <span class="text-gray-600">
                            <div>
                                <span
                                    class="curor-default hover:text-gray-900"
                                    alt="{['GPT-4o-mini',"GPT-4.1-mini", "GPT-4.1-nano",'gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-flash-1.5', 'deepseek-r1', 'deepseek-chat',  'qwq-32b'].join(', ')}"
                                    title="{['GPT-4o-mini',"GPT-4.1-mini", "GPT-4.1-nano",'gemini-2.0-flash-lite', 'gemini-2.0-flash', 'gemini-flash-1.5', 'deepseek-r1', 'deepseek-chat',  'qwq-32b'].join(', ')}">
                                    {$t("app.modelCheap",{default:"Lite Models"})}
                                </span>
                                <span class="ml-10">{cheap}</span>
                            </div>
                            <div>
                                <span
                                    class="curor-default hover:text-gray-900"
                                    alt="{['GPT-o1-mini', 'GPT-o3-mini', 'GPT-4o',"GPT-4.1",'gemini-pro-1.5', 'claude-3.5-haiku', 'claude-3.7-sonnet', 'claude-3.5-sonnet', 'claude-4-sonnet','qwen-plus'].join(', ')}"
                                    title="{['GPT-o1-mini', 'GPT-o3-mini', 'GPT-4o',"GPT-4.1",'gemini-pro-1.5', 'claude-3.5-haiku', 'claude-3.7-sonnet', 'claude-3.5-sonnet', 'claude-4-sonnet','qwen-plus'].join(', ')}"
                                    >
                                    {$t("app.modelNormal",{default:"Balanced Models"})}
                                </span>
                                <span class="ml-10">{normal}</span>
                            </div>
                            <div><span
                                    class="curor-default hover:text-gray-900"
                                    alt="{['GPT-o1','GPT-o3','claude-4-opus'].join(', ')}"
                                    title="{['GPT-o1','GPT-o3','claude-4-opus'].join(', ')}"
                                    >
                                    {$t("app.modelExpensive",{default:"Elite Models"})}
                                </span>
                                <span class="ml-10">{expensive}</span>
                            </div>
                        </span>
                    </div>
                </div>
                <div class="setting-item-group">
                    <div class="setting-item">
                        <span class="setting-lable"
                            >{$t("settings.language")}</span
                        >
                        <select
                            class=""
                            on:change={changeLanguage}
                            bind:value={$locale}
                        >
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
                            <span class="setting-lable"
                                >{$t("settings.sendKey")}</span
                            >
                            <select class="" on:change={changeSendKey}>
                                {#each keys as k}
                                    {#if k != breakk}
                                        {#if k == sendk}
                                            <option
                                                class="text-gray-600"
                                                selected>{k}</option
                                            >
                                        {:else}
                                            <option class="text-gray-600"
                                                >{k}</option
                                            >
                                        {/if}
                                    {/if}
                                {/each}
                            </select>
                        </div>
                        <div class="setting-item">
                            <span class="setting-lable"
                                >{$t("settings.lineBreakKey")}</span
                            >
                            <select class="" on:change={changeBreakLineKey}>
                                {#each keys as k}
                                    {#if k != sendk}
                                        {#if k == breakk}
                                            <option
                                                class="text-gray-600"
                                                selected>{k}</option
                                            >
                                        {:else}
                                            <option class="text-gray-600"
                                                >{k}</option
                                            >
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
                        <span class="setting-lable"
                            >{$t("settings.currentV")}</span
                        >
                        <span class="text-gray-600">Version 1.1.0</span>
                    </div>
                    <div class="setting-item">
                        <span class="setting-lable"
                            >{$t("settings.termsText")}</span
                        >
                        <span>
                        <a
                            class="hover:text-blue-700 hover:underline"
                            href="./terms"
                            target="_blank"
                            >{$t("login.serviceTermsLink",{default:"EULA"})}</a
                        > & <a
                        class="hover:text-blue-700 hover:underline"
                        href="./privacy"
                        target="_blank"
                        >{$t("home.footer.privacy",{default:"Privacy Policy"})}</a
                        ></span>
                    </div>
                    <div class="setting-item">
                        <span class="setting-lable"
                            >{$t("settings.userSupport")}</span
                        >
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
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    /* Center the settings window horizontally and vertically */
    .min-h-screen {
        min-height: calc(100vh - 4rem);
    }

    /* Adjust the width of the settings window */
    .bg-white {
        width: 24rem;
    }

    /* Add some padding to the text input */
    .border {
        padding: 0.5rem;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .animate-fade-in {
        animation-name: fadeIn;
        animation-duration: 0.2s;
        animation-fill-mode: forwards;
    }
    input:checked ~ .dot {
        transform: translateX(1.5rem);
        background-color: #8ee78e;
    }

    .setting-items::-webkit-scrollbar {
        transform: translateX(-0.5rem);
    }

    .setting-items {
        @apply w-full overflow-y-auto h-[calc(90vh_-_9.75rem)] px-4 sm:px-8;
    }

    .setting-item-group {
        @apply w-full bg-white text-black rounded-lg shadow-md mb-4 border border-themegreyborder;
        width: 100% !important;
    }

    .setting-item {
        @apply flex flex-wrap sm:justify-between items-center mx-2 py-2;
    }

    .setting-item select {
        @apply bg-secondary rounded-lg p-1 min-w-[6rem] border border-themegreyborder;
        background-image: url("../assets/toggle.svg"); 
        background-repeat: no-repeat;
        background-position: right 0.5rem center; 
        background-size: 10px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding-right: 2.5rem;
        padding-left: 0.5rem;
    }

    .setting-lable {
        @apply mr-5 whitespace-nowrap leading-[2];
    }
    .setting-item select:focus-visible {
        @apply outline-themegreen;
    }

    .setting-item select option {
        @apply pr-8;
    }
</style>
