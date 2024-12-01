<script>
    let a = true;
    function test() {}
</script>

<!--登录框-->
<div>
    <!-- 关闭 -->
    <div></div>

    {#if a}
        <!-- 邮箱输入框，登录按钮，google登录 -->
        <div>
            <!-- 邮箱输入框 -->
            <input />
            <!-- 登录 -->
            <button></button>
            <button></button>
        </div>
    {:else}
        <!-- 密码输入框 -->
        <div>
            <!-- 返回 -->
            <div on:click={test}></div>
            <div>返回上一页</div>
        </div>
    {/if}
</div>
