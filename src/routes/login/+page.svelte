<script>
  import { t } from "svelte-i18n"; // 导入本地化方法
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  // import type { AnyNode } from 'postcss';

  let loginPageName = '初始输入邮箱验证';
  let showCloseBtn = false;
  let showToast = false;
  let email = "";
  let password = "";
  let error = "";
  let successMessage = "";
  $: isFormValid = email !== '' && password !== '';
  const dispatch = createEventDispatcher();
// 邮箱提交方法
async function handleEmailSubmit() {
    if(!validateEmail(email)){
      error = "请输入正确的邮箱地址";
      return;
    }

    password = await hash256(password);
    console.log(password)
  }

  //验证邮箱格式函数
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // 密码加密函数
  async function hash256(str) {
    // 将输入字符串转为 ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(str);

    // 使用 SubtleCrypto API 计算 SHA-256 哈希值
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // 将 ArrayBuffer 转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // 将 buffer 转为字节数组
    const hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join(""); // 转为十六进制字符串
    return hashHex;
  }

  function handleGoogleLogin() {
    // 使用Google登录
  }

  function handleForgotPassword() {
    // 忘记密码方法
  }
</script>

<style>

</style>


<!--登录框-->
<div class="bg-white p-10 rounded-lg shadow-md w-full max-w-md relative">
  <!-- 关闭按钮 -->
  {#if showCloseBtn}
    <button class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
      &times;
    </button>
  {/if}
  
  <!-- 登录内容容器 -->
  <div class="transition-all">
      <!-- 输入email验证状态 -->
      {#if loginPageName === '初始输入邮箱验证'}
        <h1 class="text-3xl font-semibold text-center mb-6">uuGPT</h1>
        <form on:submit|preventDefault={handleEmailSubmit}>
          <input
            type="email"
            class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            bind:value={email}
            required
            placeholder="请输入邮箱"
          />
          <div class="flex items-center mb-4">
            <input type="checkbox" id="terms" class="mr-2" />
            <label for="terms" class="text-sm">我同意 uuGPT 服务条款</label>
          </div>
          <button
            type="submit"
            class="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            下一步
          </button>
        </form>
        <hr class="my-6">
        <!-- google登录 -->
        <div class="text-center">
          <button
            on:click={handleGoogleLogin}
            class="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            使用 Google 登录
          </button>
        </div>
      {/if}

      <!-- 登录输入密码 -->
      {#if loginPageName === '登录时输入密码'}

          <!-- 登录框左上角标题栏(绝对定位) -->
          <div>
              <!-- 返回按钮 -->
              <button class="backBtn"></button>
              <span>TITLE</span>
          </div>
          
          <!-- 填写密码表单 -->
          <form>
              <input type="password" placeholder="请输入密码" />
              <button>登录</button>
          </form>

          <!-- 忘记密码链接 -->
          <div class="mt-6 text-center">
              <button
              on:click={handleForgotPassword}
              class="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
              忘记密码？
              </button>
          </div>


      {/if}

      <!-- 输验证码 -->
      {#if loginPageName === '输验证码'}
          <!-- 登录框左上角标题栏(绝对定位) -->
          <div>
              <!-- 返回按钮 -->
              <button class="backBtn"></button>
              <span>TITLE</span>
          </div>
          <!-- 填写验证码表单 -->
          <form>
              <p>请输入发送至的6位验证码，有效期5分钟</p>
              <input type="text" placeholder="请输入验证码" />
              <!-- 发送验证码需要改文案 -->
              <button>发送验证码</button>
              <button>下一步</button>
          </form>
      {/if}

      {#if loginPageName === '设置新密码'}
          <!-- 登录框左上角标题栏(绝对定位) -->
          <div>
              <!-- 返回按钮 -->
              <button class="backBtn"></button>
              <!-- 注册和忘记密码需要不同的标题 -->
              <span>设置密码/设置新密码</span>
          </div>
          <!-- 填写验证码表单 -->
          <form>

              <p>请输入新密码/请设置登录密码</p>
              <input type="password" placeholder="设置登录密码/请输入新密码" />
              <input type="password" placeholder="请再次输入密码" />
              <button>确认</button>
          </form>
      {/if}

      {#if error}
      <div class="text-red-500 text-sm mb-5">{error}</div>
      {/if}
      {#if successMessage}
        <div class="text-green-500 text-sm mb-5">{successMessage}</div>
      {/if}

  </div>
</div>
