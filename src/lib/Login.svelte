<script>
    let showCloseBtn = true;
    let loginPageName = 'inputEmail';

    
    function test() {}

    function handleGoogleLogin(){}


    function handleForgotPassword(){}

</script>

<!--登录框-->
<div>
    <!-- 关闭按钮 -->
    {#if showCloseBtn}
        <button></button>
    {/if}
    
    <!-- 登录内容容器 -->
    <div>
        <!-- 输入email验证状态 -->
        {#if loginPageName === '初始输入邮箱验证'}
            <h1 class="text-3xl font-semibold text-center mb-6">登录到 uuGPT</h1>
            <form>
                <input type="email" placeholder="请输入邮箱" />
                <input type="checkbox" title="我同意 uuGPT 服务条款" />
                <button>下一步</button>
            </form>
            
            <hr>
            <!-- google登录 -->
            <div class="mt-6 text-center">
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
                <p>请输入发送至 {} 的6位验证码，有效期5分钟</p>
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

        {#if showToast}
            <Toast />
        {/if}

    </div>
</div>
