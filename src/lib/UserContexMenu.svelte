<script>
    import { fade } from 'svelte/transition';
    import { onMount } from "svelte";
    import { t } from 'svelte-i18n';
    import passwordIcon from '../assets/login/password.svg';
    import logoutIcon from '../assets/login/logout.svg';
    import changePasswordIcon from '../assets/login/resetpassword.svg';
    import planIcon from '../assets/login/plan.svg';
    import accountIcon from '../assets/login/account.svg';
    import settingsIcon from '../assets/settings.svg';
    import feedbackIcon from '../assets/feedback.svg';



    let useremail = "rt@test.com";

</script>

<div class="fixed top-0 left-0 w-screen h-screen" style="z-index: 1000; background:rgba(0,0,0,0.6)">

<div
    class="absolute z-50 py-2 min-w-[180px] max-w-[280px] bg-white border border-gray-300 rounded-lg mt-2 shadow-lg z-10 max-h-[300px] overflow-y-auto dropdown-menu
    max-md:left-2 max-md:bottom-[60px]
    min-md:right-2 min-md:top-[36px]
    "
    transition:fade={{ duration: 300 }}
>
  <div class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-themegreen h-5 w-5">
        <img class="h-5 w-5" src={accountIcon} alt="uuGPt account"/>
    </div>
    <span class="whitespace-nowrap">{useremail}</span>
  </div>

  <div class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-themegreen h-5 w-5">
        <img class="h-5 w-5" src={passwordIcon} alt="uuGPt account"/>
    </div>
    <span class="whitespace-nowrap">{$t("login.changePassword")}</span>
  </div>

  <div class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-themegreen h-5 w-5">
        <img src={planIcon} alt="uuGPt account"/>
    </div>
    <span class="whitespace-nowrap">{$t("app.myPlan")}</span>
  </div>

  <div role="separator" aria-orientation="horizontal" class="mx-5 my-1 h-px bg-themegreyborder"></div>
  <div class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-themegreen h-5 w-5">
        <img src={settingsIcon} alt="Settings"/>
    </div>
    <span class="whitespace-nowrap">{$t("settings.title")}</span>
  </div>

  <div class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-themegreen h-5 w-5">
        <img src={feedbackIcon} alt="Feedback"/>
    </div>
    <span class="whitespace-nowrap">{$t("app.feedback")}</span>
  </div>
  <div role="separator" aria-orientation="horizontal" class="mx-5 my-1 h-px bg-themegreyborder"></div>
  <div class="flex items-center text-sm cursor-pointer disabled:opacity-50 group relative hover:bg-[#f5f5f5] rounded-md my-0 px-2 mx-2 gap-2.5 py-2 pr-3">
    <div class="flex items-center justify-center text-themegreen h-5 w-5">
        <img src={logoutIcon} alt="Log out" class="ml-[-2px]"/>
    </div>
    <span class="whitespace-nowrap">{$t("login.logout")}</span>
  </div>
</div>
</div>