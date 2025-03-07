<script lang="ts">
  import { flip } from "svelte/animate"; //不能直接导入animate，需要导入animate里的方法
  import { t } from "svelte-i18n"; // 导入本地化方法
  import { onMount } from "svelte";
  import { getErrorMessage } from "../utils/generalUtils";
  import { createEventDispatcher } from "svelte";
  import uugpIcon from "../assets/aianswer-avtar.svg";
  import accountIcon from "../assets/login/account.svg";
  import avtarIcon from "../assets/login/avtar_placeholder.svg";
  import backIcon from "../assets/login/back.svg";
  import closeIcon from "../assets/login/close.svg";
  import eyeCloseIcon from "../assets/login/eyeclose.svg";
  import eyeOpenIcon from "../assets/login/eyeopen.svg";
  import forgotIcon from "../assets/login/forgot.svg";
  import googleIcon from "../assets/login/google.svg";
  import passwordIcon from "../assets/login/password.svg";
  import resetpasswordIcon from "../assets/login/resetpassword.svg";
  import verifyIcon from "../assets/login/verify.svg";
  import {
    showErrorMessage,
    showSuccessMessage,
  } from "../stores/globalParamentStores";
  import {
    checkUserEmail,
    sendUserEmailCode,
    checkverifycode,
    setUserPassword,
    resetUserPassword,
    userLogin,
  } from "../manages/userinfoManages";
  import { writable, get } from "svelte/store";
  import {userEmail} from "../stores/userStores";
  import {isGuest} from "../stores/globalParamentStores";
  export let isPage; //通过父组件判断是否显示关闭按钮
  export let isResetPassword;
  // export let isResetPassword = false;//通过父组件判断是否是重置密码窗口
  const dispatch = createEventDispatcher();
  const status_email = "email";
  const status_password = "password";
  const status_vcode = "vcode";
  const status_resetPassword = "resetPassword";
  const status_forgetPassword = "forgetPassword";
  const currentStatus: string[] = [];
  const loginPageName = writable(""); //当前窗口

  let email = ""; //输入的邮箱
  let password = ""; //输入的密码
  let confirmPassword = ""; //输入的确认密码
  let verifyCode = "";
  let isAgree = true; //同意协议
  let showPassword = false; // 是否显示密码明文
  let isWaitting = false; // 是否正在加载中，用于控制按钮的禁用和loading状态
  let sendedVcode = false; // 是否正在发送验证码
  let timeLeft = 0; //验证码倒计时
  let error = "";
  let successMessage = "";
  let forgotPassword = false; //是否忘记密码

  loginPageName.subscribe((value) => {
    password = "";
    confirmPassword = "";
    verifyCode = "";
    showPassword = false;
    isWaitting = false;
  });

  onMount(async () => {
    // console.log(isPage);
    // if(isResetPassword){
    //   changeStatus(status_resetPassword);
    // }
    // email = "m18636399676@163.com";

    if(isResetPassword){
      email = get(userEmail)
      forgotPassword = true;
      changeStatus(status_vcode);
    }else{
      changeStatus(status_email);
    }
    
  });
  //验证邮箱
  async function handleEmailSubmit() {
    // 格式验证
    if (!validateEmail(email)) {
      showErrorMessage($t("login.emailFormatError"));
      return;
    }
    //勾选同意协议
    if (!isAgree) {
      showErrorMessage($t("login.agreeTermsError"));
      return;
    }
    isWaitting = true;
    let res = await checkUserEmail(email);
    isWaitting = false;
    if (res === 1) {
      console.log(res);
      showErrorMessage(getErrorMessage(res.toString()));
      return;
    }
    if (res) {
      changeStatus(status_password);
    } else {
      changeStatus(status_vcode);
    }
  }
  //发送验证码
  async function handleSendVcode() {
    sendedVcode = true;
    timeLeft = 60;
    let timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
      } else {
        sendedVcode = false;
        clearInterval(timer);
      }
    }, 1000);
    let res = await sendUserEmailCode(email);
    isWaitting = false;
    if (res != 0) {
      showErrorMessage(getErrorMessage(res.toString()));
      return;
    }
    showSuccessMessage($t("login.verificationCodeSentSuccess"));
  }
  //验证邮箱验证码
  async function handleCheckVcode() {
    let regex = /^\d{6}$/;
    if (!verifyCode) {
      showErrorMessage($t("login.enterVerificationCodeError"));
      return;
    }
    if (!regex.test(verifyCode)) {
      showErrorMessage($t("login.invalidVerificationCodeError"));
      return;
    }
    isWaitting = true;
    let res = await checkverifycode(verifyCode);
    isWaitting = false;
    if (res != 0) {
      showErrorMessage(getErrorMessage(res.toString()));
      return;
    }
    showSuccessMessage($t("login.verifySuccess"));
    changeStatus(status_resetPassword);
  }
  //设置密码
  async function handleSetPassword() {
    if (!password || !confirmPassword) {
      showErrorMessage($t("login.enterPasswordError"));
      return;
    }
    if (password != confirmPassword) {
      showErrorMessage($t("login.passwordRepeatError"));
      return;
    }
    const regex_chat = /^[a-zA-Z0-9@#$%^&*!]+$/;
    const regex_length = /^.{6,24}$/;
    if (!regex_chat.test(password)) {
      showErrorMessage($t("login.invalidPasswordCharacterError"));
      return;
    }
    if (!regex_length.test(password)) {
      showErrorMessage($t("login.passwordLengthError"));
      return;
    }
    isWaitting = true;
    let res;
    if (forgotPassword) {
      res = await resetUserPassword(email, password);
    } else {
      res = await setUserPassword(email, password);
    }
    // let res = await setUserPassword(email,password);
    isWaitting = false;

    if (res != 0) {
      showErrorMessage(getErrorMessage(res.toString()));
      return;
    }

    res = await userLogin(email, password);
    if (res != 0) {
      showErrorMessage(getErrorMessage(res.toString()));
      return;
    }

    showSuccessMessage(
      forgotPassword
        ? $t("login.resetPasswordSuccess")
        : $t("login.loginSuccess"),
    );
    forgotPassword = false;
    loginSuccess();
  }
  //登录
  async function handleLogin() {
    if (!password) {
      showErrorMessage($t("login.passwordPlaceholder"));
      return;
    }

    isWaitting = true;
    let res = await userLogin(email, password);
    isWaitting = false;
    if (res != 0) {
      showErrorMessage(getErrorMessage(res.toString()));
      return;
    }
    if(get(isGuest)){
            localStorage.setItem("current_chat_id", '0');
            isGuest.set(false);
        }
    showSuccessMessage($t("login.loginSuccess"));
    loginSuccess();
  }
  //忘记密码的邮箱验证码是单独的接口
  async function handleSendForgetPasswordVscode() {
    
  }

  async function forgetPassword(){

  }
  // 处理Google登录
  function handleGoogleLogin() {
    // 使用Google登录
  }

  function handleForgotPassword() {
    forgotPassword = true;
    changeStatus(status_forgetPassword);
  }

  function validateEmail(email: string) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  //关闭窗口事件
  function close() {
    dispatch("close-card");
  }
  function loginSuccess() {
    dispatch("login-success");
  }
  //切换窗口
  function changeStatus(to: string) {
    currentStatus.push(to);
    loginPageName.set(to);
  }
  //返回
  function back() {
    currentStatus.pop();
    console.log(currentStatus);
    loginPageName.set(currentStatus[currentStatus.length - 1]);
  }
</script>

<div  class={isPage? "" : "login-viewbox"}>
  <div class="flex items-center justify-center min-h-screen">
    <div
      class="bg-white p-6 md:p-10 rounded-lg shadow-md w-full h-screen md:w-auto md:min-w-[32rem] md:max-h-[32rem] relative"
    >
      <div>
        <!-- 关闭按钮 -->
        {#if !isPage}
          <button class="absolute top-4 right-4" on:click={close}>
            <img
              src={closeIcon}
              alt={$t("login.close")}
              class="w-10 h-10 text-gray-500 hover:bg-gray-200 rounded"
            />
          </button>
        {/if}

        <!-- 登录内容容器 -->
        {#if $loginPageName === status_email}
          <div class="animate-fade">
            <h1
              class="text-3xl font-semibold text-center mt-10 mb-10 flex items-center justify-center space-x-3"
            >
              <img src={uugpIcon} alt="uuGPT Logo" class="w-10 h-10" />
              <span>uuGPT</span>
            </h1>
            <form on:submit={handleEmailSubmit}>
              <label for="email" class="sr-only">{$t("login.email")}</label>
              <div class="relative w-full">
                <img
                  src={accountIcon}
                  alt={$t("login.email")}
                  class="absolute left-3 top-3 w-6 h-6 opacity-20"
                />
                <input
                  type="email"
                  class="w-full pl-12 p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                  bind:value={email}
                  required
                  placeholder={$t("login.emailPlaceholder")}
                />
              </div>
              <div class="flex items-center mb-4 w-full">
                <input type="checkbox" bind:checked={isAgree} class="mr-2" />
                <label for="terms" class="text-sm flex-1"
                  >{$t("login.agreeTerms")}
                  <a
                    class="hover:text-blue-700 hover:underline"
                    href="https://www.maxthon.com/zh/docs/eula/"
                    >{$t("login.serviceTermsLink")}</a
                  ></label
                >
              </div>
              <button
                disabled={isWaitting}
                on:click={handleEmailSubmit}
                type="submit"
                class="w-full bg-themegreen py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen disabled:opacity-50 flex items-center justify-center"
              >
                <span class="text-white font-semibold"
                  >{$t("login.nextStep")}</span
                >
                <!-- 加载过程禁用按钮并显示loading动画 -->
                {#if isWaitting}<span class="message-loader w-6 h-6 ml-3"
                  ></span>{/if}
              </button>
            </form>
<!-- 
            <div class="flex items-center my-6">
              <hr class="flex-grow border-gray-300" />
              <span class="px-4 text-gray-500 text-sm">{$t("login.or")}</span>
              <hr class="flex-grow border-gray-300" />
            </div> -->

            <!-- Google 登录 -->
            <!-- <div class="text-center">
              <button
                on:click={handleGoogleLogin}
                class="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
              >
                <img src={googleIcon} alt="Google" class="w-5 h-5 mr-2" />
                {$t("login.loginWithGoogle")}
              </button>
            </div> -->


            
          </div>
        {/if}

        <!-- 登录输入密码 -->
        {#if $loginPageName === status_password}
          <div class="animate-fade">
            <!-- 登录框左上角标题栏 -->
            <div class="flex items-center mb-6">
              <button
                on:click={back}
                class="mr-2 text-gray-700 text-xl cursor-pointer transition-colors duration-300 hover:bg-gray-200 focus:outline-none rounded"
              >
                <img src={backIcon} alt={$t("login.back")} class="w-8 h-8" />
              </button>
              <span class="text-lg font-semibold">{$t("login.loginTitle")}</span
              >
            </div>

            <!-- 填写密码表单 -->
            <div class="mt-10">
              <form on:submit|preventDefault={handleLogin}>
                <h3 class="ml-1 mb-5 text-themegreen text-xl font-semibold">
                  <span class="mr-3">🎉</span>{$t("login.welcomeBack")}
                </h3>
                <div class="mb-5 flex">
                  <div
                    class="flex items-center bg-gray-100 rounded-md p-2 pr-4"
                  >
                    <img src={avtarIcon} alt="uugpt user avatar" class="mr-3" />
                    <span>{email ? email : "User"}</span>
                  </div>
                </div>
                <div class="relative w-full mb-4">
                  <!-- 左侧密码图标 -->
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <img
                      src={passwordIcon}
                      alt="uupgt password icon"
                      class="w-4 h-4 text-gray-400 opacity-20"
                    />
                  </span>
                  <!-- 密码输入框 -->
                  {#if showPassword}
                    <input
                      type="text"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={password}
                      required
                      autofocus
                      placeholder={$t("login.passwordPlaceholder")}
                    />
                  {:else}
                    <input
                      type="password"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={password}
                      required
                      autofocus
                      placeholder={$t("login.passwordPlaceholder")}
                    />
                  {/if}

                  <!-- 右侧显示/隐藏密码图标 -->

                  <button
                    on:click={() => {
                      showPassword = !showPassword;
                    }}
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer hover:bg-gray-200 rounded"
                    aria-label="Toggle password visibility"
                  >
                    {#if showPassword}
                      <img
                        src={eyeOpenIcon}
                        alt="uupgt password show icon"
                        class="w-4 h-4 text-gray-400"
                      />
                    {:else}
                      <img
                        src={eyeCloseIcon}
                        alt="uupgt password hide icon"
                        class="w-4 h-4 text-gray-400 opacity-20"
                      />
                    {/if}
                  </button>
                </div>
                <div class="h-8"></div>
                <button
                  disabled={isWaitting}
                  on:click={handleLogin}
                  type="submit"
                  class="w-full bg-themegreen py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen disabled:opacity-50 flex items-center justify-center"
                >
                  <span class="text-white font-semibold"
                    >{$t("login.login")}</span
                  >
                  <!-- 加载过程禁用按钮并显示loading动画 -->
                  {#if isWaitting}<span class="message-loader w-6 h-6 ml-3"
                    ></span>{/if}
                </button>
              </form>
              <!-- 忘记密码链接 -->
              <div class="mt-6 text-center">
                <button
                  on:click={handleForgotPassword}
                  class="text-sm text-themegreen hover:underline py-2 px-5"
                >
                  <span>{$t("login.forgotPassword")}</span>
                </button>
              </div>
            </div>
          </div>
        {/if}

        <!-- 输验证码 -->
        {#if $loginPageName === status_vcode}
          <div class="animate-fade">
            <!-- 登录框左上角标题栏 -->
            <div class="flex items-center mb-6">
              <button
                on:click={back}
                class="mr-2 text-gray-700 text-xl cursor-pointer transition-colors duration-300 hover:bg-gray-200 focus:outline-none rounded"
              >
                <img src={backIcon} alt={$t("login.back")} class="w-8 h-8" />
              </button>
              <span class="text-lg font-semibold"
                >{$t("login.enterVerificationTitle")}</span
              >
            </div>

            <div class="mt-10">
              <form>
                <p class="mb-2">
                  请输入发送至 {email ? email : "Email"} 的6位验证码，有效期5分钟
                </p>

                <!-- 发送验证码按钮，有倒计时，加载完成后先自动发送一次 -->
                <button
                  disabled={sendedVcode}
                  on:click={handleSendVcode}
                  type="button"
                  class="text-themegreen hover:underline py-2 mb-5"
                >
                  {sendedVcode
                    ? `${timeLeft}s后重新发送`
                    : $t("login.sendVerificationCode")}
                </button>

                <div class="relative w-full mb-4">
                  <!-- 左侧验证图标 -->
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <img
                      src={verifyIcon}
                      alt="uupgt password icon"
                      class="w-4 h-4 text-gray-400 opacity-20"
                    />
                  </span>
                  <input
                    bind:value={verifyCode}
                    type="text"
                    class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                    placeholder={$t("login.verificationCodePlaceholder")}
                    required
                    autofocus
                  />
                </div>
                <div class="h-8"></div>

                <button
                  disabled={isWaitting}
                  on:click={handleCheckVcode}
                  type="submit"
                  class="w-full bg-themegreen text-white font-semibold py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen"
                >
                  {$t("login.nextStep")}
                </button>
              </form>
            </div>
          </div>
        {/if}
        <!-- 忘记密码重置 -->
        {#if $loginPageName === status_forgetPassword}
          <div class="animate-fade">
            <!-- 登录框左上角标题栏 -->
            <div class="flex items-center mb-6">
              <button
                on:click={back}
                class="mr-2 text-gray-700 text-xl cursor-pointer transition-colors duration-300 hover:bg-gray-200 focus:outline-none rounded">
                <img src={backIcon} alt={$t("login.back")} class="w-8 h-8" />
              </button>
              <span class="text-lg font-semibold">
                {$t("login.resetPasswordTitle")}
              </span>
            </div>
            <div class="mt-10">
              <form>
                <p class="mb-2">
                  请输入发送至 {email ? email : "Email"} 的6位验证码，有效期5分钟
                </p>

                <!-- 发送验证码按钮，有倒计时，加载完成后先自动发送一次 -->
                <button
                  disabled={sendedVcode}
                  on:click={handleSendVcode}
                  type="button"
                  class="text-themegreen hover:underline py-2 mb-5"
                >
                  {sendedVcode
                    ? `${timeLeft}s后重新发送`
                    : $t("login.sendVerificationCode")}
                </button>

                <div class="relative w-full mb-4">
                  <!-- 左侧验证码图标 -->
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <img
                      src={verifyIcon}
                      alt="uupgt password icon"
                      class="w-4 h-4 text-gray-400 opacity-20"
                    />
                  </span>
                  <input
                    bind:value={verifyCode}
                    type="text"
                    class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                    placeholder={$t("login.verificationCodePlaceholder")}
                    required
                    autofocus
                  />
                </div>
                <div class="relative w-full mb-4">
                  <!-- 左侧密码图标 -->
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <img
                      src={passwordIcon}
                      alt="uupgt password icon"
                      class="w-4 h-4 text-gray-400 opacity-20"
                    />
                  </span>
                  <!-- 密码输入框 -->
                  {#if showPassword}
                    <input
                      type="text"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={password}
                      required
                      autofocus
                      placeholder={$t("login.resetPasswordPlaceholder")}
                    />
                  {:else}
                    <input
                      type="password"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={password}
                      required
                      autofocus
                      placeholder={$t("login.resetPasswordPlaceholder")}
                    />
                  {/if}

                  <!-- 右侧显示/隐藏密码图标 -->

                  <button
                    on:click={() => {
                      showPassword = !showPassword;
                    }}
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer hover:bg-gray-200 rounded"
                    aria-label="Toggle password visibility"
                  >
                    {#if showPassword}
                      <img
                        src={eyeOpenIcon}
                        alt="uupgt password show icon"
                        class="w-4 h-4 text-gray-400"
                      />
                    {:else}
                      <img
                        src={eyeCloseIcon}
                        alt="uupgt password hide icon"
                        class="w-4 h-4 text-gray-400 opacity-20"
                      />
                    {/if}
                  </button>
                </div>
                <div class="relative w-full mb-4">
                  <!-- 左侧密码图标 -->
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <img
                      src={passwordIcon}
                      alt="uupgt password icon"
                      class="w-4 h-4 text-gray-400 opacity-20"
                    />
                  </span>
                  <!-- 密码输入框 -->
                  {#if showPassword}
                    <input
                      type="text"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={confirmPassword}
                      required
                      autofocus
                      placeholder={$t("login.confirmPasswordPlaceholder")}
                    />
                  {:else}
                    <input
                      type="password"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={confirmPassword}
                      required
                      autofocus
                      placeholder={$t("login.confirmPasswordPlaceholder")}
                    />
                  {/if}

                  <!-- 右侧显示/隐藏密码图标 -->

                  <button
                    on:click={() => {
                      showPassword = !showPassword;
                    }}
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer hover:bg-gray-200 rounded"
                    aria-label="Toggle password visibility"
                  >
                    {#if showPassword}
                      <img
                        src={eyeOpenIcon}
                        alt="uupgt password show icon"
                        class="w-4 h-4 text-gray-400"
                      />
                    {:else}
                      <img
                        src={eyeCloseIcon}
                        alt="uupgt password hide icon"
                        class="w-4 h-4 text-gray-400 opacity-20"
                      />
                    {/if}
                  </button>
                </div>

                <button
                  disabled={isWaitting}
                  on:click={handleSetPassword}
                  type="submit"
                  class="w-full bg-themegreen py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen disabled:opacity-50 flex items-center justify-center"
                >
                  <span class="text-white font-semibold"
                    >{$t("login.confirmAndLogin")}</span
                  >
                  <!-- 加载过程禁用按钮并显示loading动画 -->

                  {#if isWaitting}<span class="message-loader w-6 h-6 ml-3"
                    ></span>{/if}
                </button>
              </form>
            </div>
          </div>
        {/if}
        <!-- 设置新密码 -->
        {#if $loginPageName === status_resetPassword}
          <div class="animate-fade">
            <!-- 登录框左上角标题栏 -->
            <div class="flex items-center mb-6">
              <button
                on:click={back}
                class="mr-2 text-gray-700 text-xl cursor-pointer transition-colors duration-300 hover:bg-gray-200 focus:outline-none rounded"
              >
                <img src={backIcon} alt={$t("login.back")} class="w-8 h-8" />
              </button>
              <span class="text-lg font-semibold">
                {#if forgotPassword}
                  {$t("login.resetPasswordTitle")}
                {:else}
                  {$t("login.setPasswordTitle")}
                {/if}
              </span>
            </div>

            <div class="mt-10">
              <form>
                <p class="mb-4">
                  {#if forgotPassword}
                    {$t("login.resetPasswordText")}
                  {:else}
                    {$t("login.setPasswordText")}
                  {/if}
                </p>
                <div class="relative w-full mb-4">
                  <!-- 左侧密码图标 -->
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <img
                      src={passwordIcon}
                      alt="uupgt password icon"
                      class="w-4 h-4 text-gray-400 opacity-20"
                    />
                  </span>
                  <!-- 密码输入框 -->
                  {#if showPassword}
                    <input
                      type="text"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={password}
                      required
                      autofocus
                      placeholder={forgotPassword
                        ? $t("login.resetPasswordPlaceholder")
                        : $t("login.setPasswordPlaceholder")}
                    />
                  {:else}
                    <input
                      type="password"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={password}
                      required
                      autofocus
                      placeholder={forgotPassword
                        ? $t("login.resetPasswordPlaceholder")
                        : $t("login.setPasswordPlaceholder")}
                    />
                  {/if}

                  <!-- 右侧显示/隐藏密码图标 -->

                  <button
                    on:click={() => {
                      showPassword = !showPassword;
                    }}
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer hover:bg-gray-200 rounded"
                    aria-label="Toggle password visibility"
                  >
                    {#if showPassword}
                      <img
                        src={eyeOpenIcon}
                        alt="uupgt password show icon"
                        class="w-4 h-4 text-gray-400"
                      />
                    {:else}
                      <img
                        src={eyeCloseIcon}
                        alt="uupgt password hide icon"
                        class="w-4 h-4 text-gray-400 opacity-20"
                      />
                    {/if}
                  </button>
                </div>
                <div class="relative w-full mb-4">
                  <!-- 左侧密码图标 -->
                  <span
                    class="absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <img
                      src={passwordIcon}
                      alt="uupgt password icon"
                      class="w-4 h-4 text-gray-400 opacity-20"
                    />
                  </span>
                  <!-- 密码输入框 -->
                  {#if showPassword}
                    <input
                      type="text"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={confirmPassword}
                      required
                      autofocus
                      placeholder={$t("login.confirmPasswordPlaceholder")}
                    />
                  {:else}
                    <input
                      type="password"
                      class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                      bind:value={confirmPassword}
                      required
                      autofocus
                      placeholder={$t("login.confirmPasswordPlaceholder")}
                    />
                  {/if}

                  <!-- 右侧显示/隐藏密码图标 -->

                  <button
                    on:click={() => {
                      showPassword = !showPassword;
                    }}
                    type="button"
                    class="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer hover:bg-gray-200 rounded"
                    aria-label="Toggle password visibility"
                  >
                    {#if showPassword}
                      <img
                        src={eyeOpenIcon}
                        alt="uupgt password show icon"
                        class="w-4 h-4 text-gray-400"
                      />
                    {:else}
                      <img
                        src={eyeCloseIcon}
                        alt="uupgt password hide icon"
                        class="w-4 h-4 text-gray-400 opacity-20"
                      />
                    {/if}
                  </button>
                </div>
                <div class="h-8"></div>
                <button
                  disabled={isWaitting}
                  on:click={handleSetPassword}
                  type="submit"
                  class="w-full bg-themegreen py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen disabled:opacity-50 flex items-center justify-center"
                >
                  <span class="text-white font-semibold"
                    >{$t("login.confirmAndLogin")}</span
                  >
                  <!-- 加载过程禁用按钮并显示loading动画 -->

                  {#if isWaitting}<span class="message-loader w-6 h-6 ml-3"
                    ></span>{/if}
                </button>
              </form>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  @import "../styles/skeleton.css";
  .login-viewbox{
    position:fixed;
    top:0;
    left:0;
    right:0;
    bottom:0;
    z-index:1000;
    background-color:rgba(0,0,0,.6);
    height: 100vh;
    width: 100vw;
  }
</style>
