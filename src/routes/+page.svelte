<script lang="ts">
  // 示例图片导入（请自行修改实际路径）
  import heroBg from "../assets/home/hero-bg.png";
  import aiLogos from "../assets/RobotIcon.svg";
  import feature1 from "../assets/home/feature-1.png";
  import feature2 from "../assets/home/feature-2.png";
  import feature3 from "../assets/home/feature-3.png";
  import avatar1 from "../assets/home/user1.png";
  import avatar2 from "../assets/home/user2.png";
  import avatar3 from "../assets/home/user3.png";

  let isLoggedIn = false;
</script>

<!-- 整页容器 -->
<main class="min-h-screen flex flex-col bg-white">

  <!-- 顶部导航 -->
  <header class="sticky top-0 z-50 shadow-lg w-full bg-gray-800">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo / 项目名 -->
      <div class="flex items-center">
        <a href="/" class="text-2xl font-extrabold text-primary">
          UUGPT
        </a>
      </div>
      

      <!-- 菜单 (桌面端) -->
      <nav class="hidden md:flex space-x-6 text-secondary">
        <a href="/chat" class="hover:text-primary transition-colors">聊天</a>
        <a href="#features" class="hover:text-primary transition-colors">功能</a>
        <a href="/pricing" class="hover:text-primary transition-colors">价格方案</a>
        <a href="#reviews" class="hover:textprimary transition-colors">用户评价</a>
      </nav>

      <!-- 登录 / 注册 / 个人中心 -->
      {#if isLoggedIn}
        <a
          href="/profile"
          class="text-sm font-medium text-[var(--secondary,#f9f9f9)] hover:text-[var(--secondary,#f9f9f9)] transition-colors"
          >个人中心</a
        >
      {:else}
        <div class="space-x-4">
          <a
            href="/login"
            class="text-sm text-[var(--secondary,#f9f9f9)] hover:text-[var(--secondary,#f9f9f9)] transition-colors"
            >登录</a
          >
          <a
            href="/login"
            class="text-sm text-[var(--secondary,#f9f9f9)] border border-[var(--secondary,#f9f9f9)] px-4 py-1 rounded hover:bg-themegreen hover:border-transparent hover:text-primary transition-colors"
            >注册</a
          >
        </div>
      {/if}
    </div>
  </header>

  <!-- Hero Section -->
  <!-- 采用多层渐变 + 背景图叠加 -->
  <section
    class="relative w-full pt-20 pb-16 bg-gradient-to-br from-[#d522e5] via-[#7856f3] to-[#7856f3] text-white overflow-hidden"
    style="background-size: cover; background-position: center;"
  >
    <div class="absolute inset-0 bg-black bg-opacity-25 pointer-events-none"></div>
    <div class="container mx-auto px-4 text-center">
      <!-- 大标题 + 副标题 -->
      <div class="max-w-5xl mx-auto">
        <h1 class="text-3xl lg:text-5xl font-bold text-white mb-8">
          UUGPT 让多模型AI对话更高效  
        </h1>
        <p class="text-lg md:text-xl mt-4 text-white/90">
          集成 GPT、Gemini、Claude 等多模型，21 种语言支持，云端安全同步。<br />
          移动端 & PC 端统一访问，无需翻墙，中国大陆地区直连。
        </p>
      </div>

      <!-- 安装 / 使用 按钮  +  AI Logos -->
      <div class="flex flex-col md:flex-row items-start md:items-center gap-4 mb-12">
        <a
          href="/chat"
          class="inline-block px-6 py-3 bg-[var(--themegreen,#4A928C)] text-white rounded-lg hover:bg-[var(--themegreenhover,#527E7A)] transition-colors shadow font-semibold"
        >
          立即开始聊天
        </a>
        <img
          src={aiLogos}
          alt="GPT, Gemini, Claude AI 模型 Logos"
          class="w-48 h-auto"
        />
      </div>

      <!-- Hero 里的数字统计区 -->
      <div class="flex flex-wrap gap-6 text-center">
        <!-- rating example -->
        <div class="flex-1 min-w-[120px]">
          <div class="text-3xl font-bold">4.8</div>
          <div class="text-sm text-white/80 mt-1">用户评分</div>
        </div>
        <!-- user count example -->
        <div class="flex-1 min-w-[120px]">
          <div class="text-3xl font-bold">2000+</div>
          <div class="text-sm text-white/80 mt-1">活跃用户</div>
        </div>
        <!-- language count example -->
        <div class="flex-1 min-w-[120px]">
          <div class="text-3xl font-bold">21</div>
          <div class="text-sm text-white/80 mt-1">支持语言</div>
        </div>
        <!-- features count example -->
        <div class="flex-1 min-w-[120px]">
          <div class="text-3xl font-bold">15+</div>
          <div class="text-sm text-white/80 mt-1">主要特性</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Choose / Features 区域 -->
  <section id="features" class="w-full py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-[var(--themegrey,#505860)] text-center mb-10">
        为什么选择 UUGPT
      </h2>
      <!-- 参考截图的卡片布局 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature Card 1 -->
        <div
          class="p-6 border border-[var(--themegreyborder,#EBEDED)] rounded-lg hover:shadow-md transition-shadow"
        >
          <img
            src={feature1}
            alt="多模型切换图示"
            class="w-12 h-12 mb-4"
          />
          <h3 class="font-semibold text-xl text-[var(--themegrey,#505860)] mb-2">
            多模型智能对话
          </h3>
          <p class="text-sm text-[var(--themegreylight,#ABABAB)] leading-relaxed">
            轻松切换 GPT、Gemini、Claude 等模型，涵盖学术写作、编程辅助和创意生成等场景，一站式满足你的多样化需求。
          </p>
        </div>

        <!-- Feature Card 2 -->
        <div
          class="p-6 border border-[var(--themegreyborder,#EBEDED)] rounded-lg hover:shadow-md transition-shadow"
        >
          <img
            src={feature2}
            alt="灵活收费图示"
            class="w-12 h-12 mb-4"
          />
          <h3 class="font-semibold text-xl text-[var(--themegrey,#505860)] mb-2">
            灵活付费 + 首月优惠
          </h3>
          <p class="text-sm text-[var(--themegreylight,#ABABAB)] leading-relaxed">
            提供免费版、基础版、和高级版供选择。新用户首月仅需 1 美元，让你以超低成本体验 UUGPT 的强大功能。
          </p>
        </div>

        <!-- Feature Card 3 -->
        <div
          class="p-6 border border-[var(--themegreyborder,#EBEDED)] rounded-lg hover:shadow-md transition-shadow"
        >
          <img
            src={feature3}
            alt="安全加密图示"
            class="w-12 h-12 mb-4"
          />
          <h3 class="font-semibold text-xl text-[var(--themegrey,#505860)] mb-2">
            安全 & 隐私
          </h3>
          <p class="text-sm text-[var(--themegreylight,#ABABAB)] leading-relaxed">
            采用 HTTPS 加密，云端存储对话记录可自主删除。匿名用户清除 Cookie 后无痕，保障你的隐私与数据安全。
          </p>
        </div>

        <!-- 你可再添加更多 Feature Card -->
      </div>
    </div>
  </section>

  <!-- 用户评价区 -->
  <section id="reviews" class="w-full py-16 bg-[var(--themegreyhover2,#dddee1)]">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-[var(--themegrey,#505860)] text-center mb-10">
        用户怎么说
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 评论卡片1 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <img
              src={avatar1}
              alt="用户头像1"
              class="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h4 class="text-[var(--themegrey,#505860)] font-semibold">Jondier Junior</h4>
              <span class="text-xs text-[var(--themegreylight,#ABABAB)]">验证用户</span>
            </div>
          </div>
          <p class="text-sm text-[var(--themegrey,#505860)] leading-relaxed">
            “UUGPT 的多模型切换真的很方便，首月优惠的价格实在是太香了，推荐给身边朋友都说好！”
          </p>
        </div>

        <!-- 评论卡片2 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <img
              src={avatar2}
              alt="用户头像2"
              class="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h4 class="text-[var(--themegrey,#505860)] font-semibold">Paul Edison</h4>
              <span class="text-xs text-[var(--themegreylight,#ABABAB)]">验证用户</span>
            </div>
          </div>
          <p class="text-sm text-[var(--themegrey,#505860)] leading-relaxed">
            “从匿名到高级付费都能选择，非常灵活。云端存储和加密方式让我很放心，给好评。”
          </p>
        </div>

        <!-- 评论卡片3 -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex items-center mb-4">
            <img
              src={avatar3}
              alt="用户头像3"
              class="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h4 class="text-[var(--themegrey,#505860)] font-semibold">Erik Bass</h4>
              <span class="text-xs text-[var(--themegreylight,#ABABAB)]">验证用户</span>
            </div>
          </div>
          <p class="text-sm text-[var(--themegrey,#505860)] leading-relaxed">
            “界面简洁、响应速度很快，尤其在中国大陆使用完全不卡顿。对我这种需要跨语言交流的人帮助很大。”
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA: 立即体验 -->
  <section class="w-full py-16 bg-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-2xl md:text-3xl font-bold text-[var(--themegrey,#505860)] mb-6">
        马上体验 UUGPT
      </h2>
      <p class="text-[var(--themegreylight,#ABABAB)] max-w-2xl mx-auto mb-8">
        加入数千用户行列，体验更加高效便捷的 AI 对话管理，轻松应对学习、工作和创作各种场景！
      </p>
      <a
        href="/chat"
        class="inline-block px-8 py-3 bg-[var(--themegreen,#4A928C)] text-white text-lg rounded hover:bg-[var(--themegreenhover,#527E7A)] transition-colors shadow-md font-semibold"
      >
        立即开始
      </a>
    </div>
  </section>

  <!-- 页脚（深色背景） -->
  <footer class="w-full bg-[var(--themegrey,#505860)] text-white pt-12 pb-6 mt-auto">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between">

      <!-- Logo + 版权信息 -->
      <div>
        <h3 class="text-xl font-extrabold">UUGPT</h3>
        <p class="text-sm text-white/70 mt-2">
          © 2025 UUGPT. All rights reserved.
        </p>
      </div>

      <!-- 其它链接 -->
      <div class="flex flex-col md:flex-row gap-2 md:gap-6 mt-6 md:mt-0">
        <a href="/changelog" class="text-sm text-white/70 hover:text-white transition-colors"
          >Changelog</a
        >
        <a href="/faq" class="text-sm text-white/70 hover:text-white transition-colors"
          >FAQ</a
        >
        <a href="/terms" class="text-sm text-white/70 hover:text-white transition-colors"
          >Terms</a
        >
        <a href="/privacy" class="text-sm text-white/70 hover:text-white transition-colors"
          >Privacy</a
        >
      </div>
    </div>

    <!-- SEO 文字（透明显示），请谨慎使用，避免被搜索引擎视为作弊 -->
    <div class="text-transparent text-xs mt-4 px-4">
      多模型智能对话, GPT, Gemini, Claude, 21种语言支持, 云端存储,
      加密安全, 灵活付费, 中国大陆直连, AI 辅助写作, 创意生成,
      编程辅助, SvelteKit, Tailwind CSS
    </div>
  </footer>
</main>
