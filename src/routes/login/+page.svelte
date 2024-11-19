<script>
    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";
  
    let email = "";
    let password = "";
    let error = "";
  
    const dispatch = createEventDispatcher();
  
    function handleSubmit() {
      // Placeholder: Call backend API to handle email login
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            dispatch("loginSuccess", data);
          } else {
            error = data.message || "登录失败";
          }
        })
        .catch((err) => {
          error = "网络请求失败，请稍后再试。";
        });
    }
  
    function handleGoogleLogin() {
      // Placeholder: Call Google OAuth API
      window.location.href = "/api/auth/google";
    }
  
    function handleForgotPassword() {
      // Redirect to the forgot password page
      window.location.href = "/forgot-password";
    }
  </script>
  
  <main class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-96">
      <h1 class="text-2xl font-bold text-center mb-6">登录或注册</h1>
  
      <!-- 登录表单 -->
      <form on:submit|preventDefault={handleSubmit}>
        <div class="mb-4">
          <label class="block text-sm font-bold mb-2" for="email">邮箱</label>
          <input
            type="email"
            id="email"
            class="w-full p-2 border border-gray-300 rounded"
            bind:value={email}
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-bold mb-2" for="password">密码</label>
          <input
            type="password"
            id="password"
            class="w-full p-2 border border-gray-300 rounded"
            bind:value={password}
            required
          />
        </div>
        {#if error}
          <div class="text-red-500 text-sm mb-4">{error}</div>
        {/if}
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          登录
        </button>
      </form>
  
      <!-- Google 登录按钮 -->
      <button
        on:click={handleGoogleLogin}
        class="w-full bg-red-500 text-white font-bold py-2 px-4 rounded mt-4 hover:bg-red-700"
      >
        使用 Google 登录
      </button>
  
      <!-- 忘记密码链接 -->
      <button
        on:click={handleForgotPassword}
        class="text-sm text-blue-500 hover:underline mt-4"
      >
        忘记密码？
      </button>
    </div>
  </main>
  
  <style>
    main {
      padding: 2rem;
    }
  </style>
  