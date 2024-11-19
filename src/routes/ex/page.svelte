<!-- script里是写代码的 -->
<script lang="ts">
    import Settings from "../../lib/Settings.svelte";//引入settings组件
    let a = true;//控制**显示关闭
    let b = true;//控制**
</script>

{#if b}
    <!-- 一些通用的可以写成组件，在上面import引入后就可以像这个这么用 -->
  <Settings/>
{/if}

<!-- main标签里写html -->
<main>
    <!-- if else可以控制显示哪一块的html,比如点击显示用户信息面板，面板就可以写在{#if a}里，变量a需要再上面声明一下，就按我写的来就行 -->
    {#if a} 
    <div>正常html代码，其他点击事件什么的我来写，你就写样式就行</div>
    {:else}
    <div>正常html代码，其他点击事件什么的我来写</div>
    {/if}
</main>
<!-- style里写样式，也可以像下面一样引用一个文件 -->
<style>
    @import "../../styles/styles.css";
  </style>
