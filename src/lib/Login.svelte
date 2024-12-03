<script>
  import { flip } from "svelte/animate"; //不能直接导入animate，需要导入animate里的方法
  import { t } from "svelte-i18n"; // 导入本地化方法
  import { onMount } from "svelte";
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
  import {showErrorMessage,showSuccessMessage} from "../stores/globalParamentStores"

  export let isPage; //通过父组件判断是否显示关闭按钮

  const dispatch = createEventDispatcher();
  const status_email = "email";
  const status_password = "password";
  const status_vcode = "vcode";
  const status_resetPassword = "resetPassword";
  const currentStatus = [];




  let loginPageName = status_email;
  
  let email = "";
  let password = "";
  let confirmPassword = "";
  let error = "";
  let successMessage = "";

  let showPassword = false; // 是否显示密码明文

  onMount(async () => {
    // console.log(isPage);
  });

  function handleEmailSubmit() {

    // 格式验证
    if (!validateEmail(email)) {
      showErrorMessage('格式不正确');
      return;
    }



    // 模拟登录提交
    setTimeout(() => {
      if (email === "test@example.com" && password === "password") {
        successMessage = "登录成功！";
      } else {
        error = "邮箱或密码错误，请重试。";
      }
    }, 1000);

  }

  function handleGoogleLogin() {
    // 使用Google登录
  }

  function handleForgotPassword() {
    // 忘记密码方法
    error = "忘记密码功能暂未开放，请稍后再试。";
  }

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  //关闭窗口事件
  function close() {
    dispatch("close-card");
  }
</script>

<div
  class="bg-white p-6 md:p-10 rounded-lg shadow-md w-full h-screen md:w-auto md:min-w-[32rem] md:max-h-[32rem] relative"
>
  <div>
    <!-- 关闭按钮 -->
    {#if isPage}
      <button class="absolute top-4 right-4" on:click={close}>
        <img
          src={closeIcon}
          alt="关闭"
          class="w-10 h-10 text-gray-500 hover:bg-gray-200 rounded"
        />
      </button>
    {/if}

    <!-- 登录内容容器 -->
    {#if loginPageName === status_email}
      <div class="animate-fade">
        <h1
          class="text-3xl font-semibold text-center mt-10 mb-10 flex items-center justify-center space-x-3"
        >
          <img src={uugpIcon} alt="uuGPT Logo" class="w-10 h-10" />
          <span>uuGPT</span>
        </h1>
        <form>
          <label for="email" class="sr-only"> {$t("app.assistantname")}</label>
          <div class="relative w-full">
            <img
              src={accountIcon}
              alt="邮箱"
              class="absolute left-3 top-3 w-6 h-6 opacity-20"
            />
            <input
              type="email"
              class="w-full pl-12 p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
              bind:value={email}
              required
              placeholder="请输入邮箱"
            />
          </div>
          <div class="flex items-center mb-4 w-full">
            <input type="checkbox" id="terms" class="mr-2" checked />
            <label for="terms" class="text-sm flex-1"
              >我同意 uuGPT <a
                class="hover:text-blue-700 hover:underline"
                href="https://www.maxthon.com/zh/docs/eula/">服务条款</a
              ></label
            >
          </div>
          <button
          on:click={handleEmailSubmit}
            type="submit"
            class="w-full bg-themegreen py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen disabled:opacity-50 flex items-center justify-center"
          >
            <span class="text-white font-semibold">下一步</span>
            <!-- 加载过程禁用按钮并显示loading动画 -->
            <!-- <span class="message-loader w-6 h-6 ml-3"></span> -->
          </button>
        </form>

        <div class="flex items-center my-6">
          <hr class="flex-grow border-gray-300" />
          <span class="px-4 text-gray-500 text-sm">or</span>
          <hr class="flex-grow border-gray-300" />
        </div>

        <!-- Google 登录 -->
        <div class="text-center">
          <button
            on:click={handleGoogleLogin}
            class="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center"
          >
            <img src={googleIcon} alt="Google" class="w-5 h-5 mr-2" />
            {$t("login.loginWithGoogle")}
          </button>
        </div>
      </div>
    {/if}

    <!-- 登录输入密码 -->
    {#if loginPageName === status_password}
      <div class="animate-fade">
        <!-- 登录框左上角标题栏 -->
        <div class="flex items-center mb-6">
          <button
            class="mr-2 text-gray-700 text-xl cursor-pointer transition-colors duration-300 hover:bg-gray-200 focus:outline-none rounded"
          >
            <img src={backIcon} alt="返回" class="w-8 h-8" />
          </button>
          <span class="text-lg font-semibold">填写密码</span>
        </div>

        <!-- 填写密码表单 -->
        <div class="mt-10">
          <form on:submit|preventDefault={handleEmailSubmit}>
            <h3 class="ml-1 mb-5 text-themegreen text-xl font-semibold">
              <span class="mr-3">🎉</span>欢迎回来!
            </h3>
            <div class="mb-5 flex">
              <div class="flex items-center bg-gray-100 rounded-md p-2 pr-4">
                <img src={avtarIcon} alt="uugpt user avatar" class="mr-3" />
                <span>{email ? email : "User"}</span>
              </div>
            </div>
            <div class="relative w-full mb-4">
              <!-- 左侧密码图标 -->
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <img
                  src={passwordIcon}
                  alt="uupgt password icon"
                  class="w-4 h-4 text-gray-400 opacity-20"
                />
              </span>
              <!-- 密码输入框 -->
              <input
                type="password"
                id="passwordInput"
                class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                bind:value={password}
                required
                autofocus
                placeholder="请输入密码"
              />
              <!-- 右侧显示/隐藏密码图标 -->

              <button
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
              type="submit"
              class="w-full bg-themegreen py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen disabled:opacity-50 flex items-center justify-center"
            >
              <span class="text-white font-semibold">登录</span>
              <!-- 加载过程禁用按钮并显示loading动画 -->
              <!-- <span class="message-loader w-6 h-6 ml-3"></span> -->
            </button>
          </form>
          <!-- 忘记密码链接 -->
          <div class="mt-6 text-center">
            <button
              on:click={handleForgotPassword}
              class="text-sm text-themegreen hover:underline py-2 px-5"
            >
              <span>忘记密码？</span>
            </button>
          </div>
        </div>
      </div>
    {/if}

    <!-- 输验证码 -->
    {#if loginPageName === status_vcode}
      <div class="animate-fade">
        <!-- 登录框左上角标题栏 -->
        <div class="flex items-center mb-6">
          <button
            class="mr-2 text-gray-700 text-xl cursor-pointer transition-colors duration-300 hover:bg-gray-200 focus:outline-none rounded"
          >
            <img src={backIcon} alt="返回" class="w-8 h-8" />
          </button>
          <span class="text-lg font-semibold">填写验证码</span>
        </div>

        <div class="mt-10">
          <form>
            <p class="mb-2">
              请输入发送至 {email ? email : "Email"} 的6位验证码，有效期5分钟
            </p>

            <!-- 发送验证码按钮，有倒计时，加载完成后先自动发送一次 -->
            <button
              type="button"
              class="text-themegreen hover:underline py-2 mb-5"
            >
              发送验证码
            </button>

            <div class="relative w-full mb-4">
              <!-- 左侧密码图标 -->
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <img
                  src={verifyIcon}
                  alt="uupgt password icon"
                  class="w-4 h-4 text-gray-400 opacity-20"
                />
              </span>
              <input
                type="text"
                class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                placeholder="请输入验证码"
                required
                autofocus
              />
            </div>
            <div class="h-8"></div>

            <button
              type="submit"
              class="w-full bg-themegreen text-white font-semibold py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen"
            >
              下一步
            </button>
          </form>
        </div>
      </div>
    {/if}

    <!-- 设置新密码 -->
    {#if loginPageName === status_resetPassword}
      <div class="animate-fade">
        <!-- 登录框左上角标题栏 -->
        <div class="flex items-center mb-6">
          <button
            class="mr-2 text-gray-700 text-xl cursor-pointer transition-colors duration-300 hover:bg-gray-200 focus:outline-none rounded"
          >
            <img src={backIcon} alt="返回" class="w-8 h-8" />
          </button>
          <span class="text-lg font-semibold">设置密码</span>
        </div>

        <div class="mt-10">
          <form>
            <p class="mb-4">请输入新密码/请设置登录密码</p>
            <div class="relative w-full mb-4">
              <!-- 左侧密码图标 -->
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <img
                  src={passwordIcon}
                  alt="uupgt password icon"
                  class="w-4 h-4 text-gray-400 opacity-20"
                />
              </span>
              <!-- 密码输入框 -->
              <input
                type="password"
                id="passwordInput"
                class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                bind:value={password}
                required
                autofocus
                placeholder="请输入密码"
              />
              <!-- 右侧显示/隐藏密码图标 -->

              <button
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
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <img
                  src={passwordIcon}
                  alt="uupgt password icon"
                  class="w-4 h-4 text-gray-400 opacity-20"
                />
              </span>
              <!-- 密码输入框 -->
              <input
                type="password"
                id="passwordInput"
                class="w-full pl-10 pr-10 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-themegreen focus:border-transparent placeholder-gray-400"
                bind:value={confirmPassword}
                required
                autofocus
                placeholder="请输入密码"
              />
              <!-- 右侧显示/隐藏密码图标 -->

              <button
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
              type="submit"
              class="w-full bg-themegreen py-3 rounded-md hover:bg-themegreenhover focus:outline-none focus:ring-2 focus:ring-themegreen disabled:opacity-50 flex items-center justify-center"
            >
              <span class="text-white font-semibold">确认并登录</span>
              <!-- 加载过程禁用按钮并显示loading动画 -->
              <!-- <span class="message-loader w-6 h-6 ml-3"></span> -->
            </button>
          </form>
        </div>
      </div>
    {/if}

    <!-- 错误信息显示 -->
    {#if error}
      <div class="text-red-500 text-sm my-5 ml-2 animate-fade">{error}</div>
    {/if}
    {#if successMessage}
      <div class="text-green-500 text-sm my-5 ml-2 animate-fade">
        {successMessage}
      </div>
    {/if}
  </div>
</div>
