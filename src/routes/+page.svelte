<script lang="ts">
  import { t } from "svelte-i18n"; // 一定要记得 import，并在模板中使用 {$t('home.xxx')}

  // 示例图片导入（请根据实际路径修改）
  import heroBg from "../assets/home/hero-bg.png";
  import aiLogos from "../assets/RobotIcon.svg";
  import feature1 from "../assets/home/feature-1.png";
  import feature2 from "../assets/home/feature-2.png";
  import feature3 from "../assets/home/feature-3.png";
  import avatar1 from "../assets/home/user1.png";
  import avatar2 from "../assets/home/user2.png";
  import avatar3 from "../assets/home/user3.png";
  import gptIcon from "../assets/gpt.svg";
  import geminiIcon from "../assets/gemini.svg";
  import claudeIcon from "../assets/claude.svg";

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
        <a href="/chat" class="hover:text-primary transition-colors">
          {$t('home.nav.chat')}
        </a>
        <a href="#features" class="hover:text-primary transition-colors">
          {$t('home.nav.features')}
        </a>
        <a href="/pricing" class="hover:text-primary transition-colors">
          {$t('home.nav.pricing')}
        </a>
        <a href="#reviews" class="hover:textprimary transition-colors">
          {$t('home.nav.reviews')}
        </a>
      </nav>

      <!-- 登录 / 注册 / 个人中心 -->
      {#if isLoggedIn}
        <a
          href="/profile"
          class="text-sm font-medium text-[var(--secondary,#f9f9f9)] hover:text-[var(--secondary,#f9f9f9)] transition-colors"
          >{$t('home.nav.profile')}</a
        >
      {:else}
        <div class="space-x-4">
          <a
            href="/login"
            class="text-sm text-[var(--secondary,#f9f9f9)] hover:text-[var(--secondary,#f9f9f9)] transition-colors"
            >{$t('home.nav.login')}</a
          >
          <a
            href="/login"
            class="text-sm text-[var(--secondary,#f9f9f9)] border border-[var(--secondary,#f9f9f9)] px-4 py-1 rounded hover:bg-themegreen hover:border-transparent hover:text-primary transition-colors"
            >{$t('home.nav.register')}</a
          >
        </div>
      {/if}
    </div>
  </header>

  <!-- Hero Section -->
  <section
    class="relative w-full pt-20 pb-20 bg-gradient-to-br from-[#d522e5] via-[#7856f3] to-[#7856f3] text-white overflow-hidden"
    style="background-size: cover; background-position: center;"
  >
    <div
      class="absolute inset-0 transprant bg-gradient-to-r from-blue-400 to-emerald-400 pointer-events-none opacity-[0.3]"
    ></div>
    <div class="relative container mx-auto px-4 text-center z-20">
      <!-- 大标题 + 副标题 -->
      <div class="max-w-5xl mx-auto">
        <h1 class="text-3xl lg:text-5xl font-bold text-white mb-8">
          {$t('home.hero.title')}
        </h1>
        <!-- 这里可以把多行合并为一个翻译，也可以分拆 -->
        <p class="text-xl md:text-2xl lg:text-[1.5rem] mt-4 block mt-4 line-height-1.5">
          {$t('home.hero.subtitleLine1')}<br />
          {$t('home.hero.subtitleLine2')}<br />
          {$t('home.hero.subtitleLine3')}
        </p>
      </div>

      <!-- 安装 / 使用 按钮 + AI Logos -->
      <div class="flex flex-col items-center gap-8 mb-16 mt-10">
        <a
          href="/chat"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center bg-white/10 backdrop-blur-md rounded-full p-2 pr-6 hover:bg-white/15 transition-all duration-300 border border-white/20 shadow-lg shadow-black/10"
        >
          <div class="flex -space-x-2 mr-4">
            <!-- GPT Logo -->
            <div
              class="relative rounded-full transform hover:-translate-y-1 transition-transform duration-200 hover:z-10 shadow-sm"
              style="z-index: 4; width: 40px; height: 40px; padding: 4px;"
            >
              <img
                alt="GPT"
                loading="lazy"
                width="32"
                height="32"
                data-nimg="1"
                class="w-full h-full object-contain"
                src={gptIcon}
                style="color: transparent;"
              />
            </div>
            <!-- Gemini Logo -->
            <div
              class="relative rounded-full transform hover:-translate-y-1 transition-transform duration-200 hover:z-10 shadow-sm"
              style="z-index: 3; width: 40px; height: 40px; padding: 4px;"
            >
              <img
                alt="gemini"
                loading="lazy"
                width="32"
                height="32"
                data-nimg="1"
                class="w-full h-full object-contain"
                src={geminiIcon}
                style="color: transparent;"
              />
            </div>
            <!-- Claude Logo -->
            <div
              class="relative rounded-full transform hover:-translate-y-1 transition-transform duration-200 hover:z-10 shadow-sm"
              style="z-index: 2; width: 40px; height: 40px; padding: 4px;"
            >
              <img
                alt="claude"
                loading="lazy"
                width="32"
                height="32"
                data-nimg="1"
                class="w-full h-full object-contain"
                src={claudeIcon}
                style="color: transparent;"
              />
            </div>
          </div>
          <div class="flex items-center gap-2 text-white font-medium">
            <span>{$t('home.hero.startChatBtn')}</span>
            <svg
              class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </div>
        </a>
      </div>

      <!-- Hero 里的数字统计区 -->
      <div class="flex flex-wrap gap-6 text-center">
        <!-- user count example -->
        <div class="flex-1 min-w-[120px]">
          <div class="text-3xl font-bold">2000+</div>
          <div class="text-sm text-white/60 mt-1">{$t('home.hero.activeUsers')}</div>
        </div>
        <!-- language count example -->
        <div class="flex-1 min-w-[120px]">
          <div class="text-3xl font-bold">21</div>
          <div class="text-sm text-white/60 mt-1">{$t('home.hero.supportLangs')}</div>
        </div>
        <!-- features count example -->
        <div class="flex-1 min-w-[120px]">
          <div class="text-3xl font-bold">US$1</div>
          <div class="text-sm text-white/60 mt-1">{$t('home.hero.lowestPrice')}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Why Choose / Features 区域 -->
  <section id="features" class="w-full py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl font-bold text-[var(--themegrey,#505860)] text-center mb-10 mt-20"
      >
        {$t('home.features.title')}
      </h2>

      <div class="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        <!-- Feature Card 1: 多模型 -->
        <div
          class="relative group p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500
        opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          ></div>
          <div class="relative space-y-6">
            <div class="p-3 rounded-xl bg-gray-50 w-fit">
              <!-- 这里可以使用 feature1 等图，也可改成 SVG -->
              <img src={feature1} alt="多模型切换" class="w-12 h-12" />
            </div>
            <h3 class="text-xl font-semibold">
              {$t('home.features.multiModel.title')}
            </h3>
            <p class="text-gray-600 text-base leading-relaxed">
              {$t('home.features.multiModel.desc')}
            </p>
          </div>
        </div>

        <!-- Feature Card 2: 安全 & 隐私 => 更换锁的SVG图标 -->
        <div
          class="relative group p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500
        opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          ></div>
          <div class="relative space-y-6">
            <div class="p-3 rounded-xl bg-gray-50 w-fit">
              <!-- 改成锁的图标 -->
              <svg
                class="w-12 h-12 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M12 11V7a4 4 0 00-8 0v4H4a2 2 0 012-2h1m12 0h-1a2 2 0 00-2 2v4a2 2 0 002 2h1a2 2 0 002-2v-4a2 2 0 00-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-xl font-semibold">
              {$t('home.features.security.title')}
            </h3>
            <p class="text-gray-600 text-base leading-relaxed">
              {$t('home.features.security.desc')}
            </p>
          </div>
        </div>

        <!-- Feature Card 3: 灵活付费 + 首月优惠 -->
        <div
          class="relative group p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500
        opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          ></div>
          <div class="relative space-y-6">
            <div class="p-3 rounded-xl bg-gray-50 w-fit">
              <img src={feature2} alt="付费" class="w-12 h-12" />
            </div>
            <h3 class="text-xl font-semibold">
              {$t('home.features.flexiblePricing.title')}
            </h3>
            <p class="text-gray-600 text-base leading-relaxed">
              {$t('home.features.flexiblePricing.desc')}
            </p>
          </div>
        </div>

        <!-- Feature Card 4: 云端存储 -->
        <div
          class="relative group p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500
        opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          ></div>
          <div class="relative space-y-6">
            <div class="p-3 rounded-xl bg-gray-50 w-fit">
              <img src={feature3} alt="云端存储" class="w-12 h-12" />
            </div>
            <h3 class="text-xl font-semibold">
              {$t('home.features.cloudStorage.title')}
            </h3>
            <p class="text-gray-600 text-base leading-relaxed">
              {$t('home.features.cloudStorage.desc')}
            </p>
          </div>
        </div>

        <!-- Feature Card 5: 多模态功能 -->
        <div
          class="relative group p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500
        opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          ></div>
          <div class="relative space-y-6">
            <div class="p-3 rounded-xl bg-gray-50 w-fit">
              <!-- 可以自己换成对应图标 -->
              <svg
                class="w-12 h-12 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold">
              {$t('home.features.multiModal.title')}
            </h3>
            <p class="text-gray-600 text-base leading-relaxed">
              {$t('home.features.multiModal.desc')}
            </p>
          </div>
        </div>

        <!-- Feature Card 6: 智能搜索 -->
        <div
          class="relative group p-8 rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-xl"
        >
          <div
            class="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500
        opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          ></div>
          <div class="relative space-y-6">
            <div class="p-3 rounded-xl bg-gray-50 w-fit">
              <svg
                class="w-12 h-12 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold">
              {$t('home.features.intelligentSearch.title')}
            </h3>
            <p class="text-gray-600 text-base leading-relaxed">
              {$t('home.features.intelligentSearch.desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 用户评价区 -->
  <section id="reviews" class="w-full py-16 bg-gray-100">
    <div class="container mx-auto px-4">
      <h2
        class="text-3xl font-bold text-[var(--themegrey,#505860)] text-center mb-10"
      >
        {$t('home.reviews.title')}
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
              <h4 class="text-[var(--themegrey,#505860)] font-semibold">
                {$t('home.reviews.reviewer1.name')}
              </h4>
              <span class="text-xs text-[var(--themegreylight,#ABABAB)]">
                {$t('home.reviews.reviewer1.type')}
              </span>
            </div>
          </div>
          <p class="text-sm text-[var(--themegrey,#505860)] leading-relaxed">
            {$t('home.reviews.reviewer1.comment')}
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
              <h4 class="text-[var(--themegrey,#505860)] font-semibold">
                {$t('home.reviews.reviewer2.name')}
              </h4>
              <span class="text-xs text-[var(--themegreylight,#ABABAB)]">
                {$t('home.reviews.reviewer2.type')}
              </span>
            </div>
          </div>
          <p class="text-sm text-[var(--themegrey,#505860)] leading-relaxed">
            {$t('home.reviews.reviewer2.comment')}
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
              <h4 class="text-[var(--themegrey,#505860)] font-semibold">
                {$t('home.reviews.reviewer3.name')}
              </h4>
              <span class="text-xs text-[var(--themegreylight,#ABABAB)]">
                {$t('home.reviews.reviewer3.type')}
              </span>
            </div>
          </div>
          <p class="text-sm text-[var(--themegrey,#505860)] leading-relaxed">
            {$t('home.reviews.reviewer3.comment')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA: 立即体验 -->
  <section
    class="w-full py-16 bg-gradient-to-br from-[#d522e5] via-[#124781] to-[#7856f3] text-white overflow-hidden"
    style="background-size: cover; background-position: center;"
  >
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-6">
        {$t('home.cta.title')}
      </h2>
      <p class="text-white/80 max-w-2xl mx-auto mb-8">
        {$t('home.cta.subtitle')}
      </p>
      <a
        href="/chat"
        class="inline-block px-8 py-3 bg-themegreen text-white text-lg rounded hover:bg-themegreenhover transition-colors shadow-md font-semibold"
      >
        {$t('home.cta.buttonText')}
      </a>
    </div>
  </section>

  <!-- 页脚（深色背景） -->
  <footer class="w-full bg-gray-800 text-white pt-12 pb-6 mt-auto">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between">
      <!-- Logo + 版权信息 -->
      <div>
        <h3 class="text-xl font-extrabold">
          <!-- 如需多语言，可改为 {$t('home.footer.logo')} -->
          UUGPT
        </h3>
        <p class="text-sm text-white/70 mt-2">
          {$t('home.footer.copyright')}
        </p>
      </div>

      <!-- 其它链接 -->
      <div class="flex flex-col md:flex-row gap-2 md:gap-6 mt-6 md:mt-0">
        <a
          href="/changelog"
          class="text-sm text-white/70 hover:text-white transition-colors"
        >
          {$t('home.footer.changelog')}
        </a>
        <a
          href="/faq"
          class="text-sm text-white/70 hover:text-white transition-colors"
        >
          {$t('home.footer.faq')}
        </a>
        <a
          href="/terms"
          class="text-sm text-white/70 hover:text-white transition-colors"
        >
          {$t('home.footer.terms')}
        </a>
        <a
          href="/privacy"
          class="text-sm text-white/70 hover:text-white transition-colors"
        >
          {$t('home.footer.privacy')}
        </a>
      </div>
    </div>

    <div class="text-gray-800 text-xs mt-4 px-4">
      {$t('home.footer.seoText')}
    </div>
  </footer>
</main>
