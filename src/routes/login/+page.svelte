<script>
  import {t} from 'svelte-i18n'; // 导入本地化方法
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  let email = "";
  let password = "";
  let error = "";

  const dispatch = createEventDispatcher();

  function handleEmailSubmit() {
    // 邮箱提交方法
    
  }

  function handleGoogleLogin() {
    // 使用Google登录
  }

  function handleForgotPassword() {
    // 忘记密码方法
  }
</script>

<main class="flex items-center justify-center min-h-screen bg-gray-100" style="background-image: url(/src/assets/home/bg.png); background-size: cover; background-position: center;">
  
  
  <div class="bg-white p-10 rounded-lg shadow-md w-full max-w-md">
    <h1 class="text-3xl font-semibold text-center mb-6">登录到 uuGPT</h1>

    <!-- 登录表单 -->
    <form on:submit|preventDefault={handleEmailSubmit}>
      <div class="mb-5">
        <label class="block text-sm font-medium text-gray-700 mb-1" for="email">邮箱地址</label>
        <input
          type="email"
          id="email"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          bind:value={email}
          required
          placeholder="输入您的邮箱地址登录或注册"
        />
      </div>
      <div class="mb-5">
        <label class="block text-sm font-medium text-gray-700 mb-1" for="password">密码</label>
        <input
          type="password"
          id="password"
          class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          bind:value={password}
          required
        />
      </div>
      {#if error}
        <div class="text-red-500 text-sm mb-5">{error}</div>
      {/if}
      <button
        type="submit"
        class="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        登录
      </button>
    </form>

    <!-- Google 登录按钮 -->
    <div class="mt-6 text-center">
      <button
        on:click={handleGoogleLogin}
        class="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        使用 Google 登录
      </button>
    </div>

    <!-- 忘记密码链接 -->
    <div class="mt-6 text-center">
      <button
        on:click={handleForgotPassword}
        class="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        忘记密码？
      </button>
    </div>
  </div>
</main>

<style>
  main {
    padding: 2rem;
  }
</style>
