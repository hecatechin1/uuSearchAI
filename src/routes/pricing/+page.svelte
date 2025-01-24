<script lang="ts">
  import { t } from "svelte-i18n"; // 导入本地化方法
  import uuGPTLogo from '../../assets/aianswer-avtar.svg';
  import freeIcon from '../../assets/pricing/free-icon.svg';
  import basicIcon from '../../assets/pricing/basic-icon.svg';
  import standardIcon from '../../assets/pricing/standard-icon.svg';
  import proIcon from '../../assets/pricing/pro-icon.svg';
  import payAsYouGoIcon from '../../assets/pricing/pay-as-you-go-icon.svg';

  // 是否按年订阅
  let isAnnual = true;

  // 当前用户的方案，可能是 'none' | 'free' | 'basic' | 'pro'
  let currentUserPlan: string = 'free';

  // 逻辑：某些方案在当前订阅情况下不显示按钮
  function showFreeButton() {
    // 如果已经是basic/pro就不展示free按钮
    return !(currentUserPlan === 'basic' || currentUserPlan === 'pro');
  }
  function showBasicButton() {
    // 如果已经是pro则不展示basic按钮
    return !(currentUserPlan === 'pro');
  }
  function showproButton() {
    // pro永远可以显示（即使当前是pro，也只是在按钮里区分是否禁用）
    return true;
  }
  // 按钮文字
  function getButtonText(plan: string): string {
    return currentUserPlan === plan ? $t("pricing.currentPlan") : $t("pricing.selectPlan");
  }

  // pricing数据
  // 将 feature 的翻译键储存在 features 数组中，后面用 #each 渲染
  const pricing = {
    free: {
      features: [
        "pricing.freePlanFeature1",
        "pricing.freePlanFeature2"
      ]
    },
    basic: {
      monthlySubsequent: 4.9,   // 月付之后的价格
      annualSubsequent: 4.08,   // 年付折算月价
      annualTotal: 49,
      annualSaveText: $t("pricing.basicAnnualSaveText"),
      features: [
        "pricing.basicPlanFeature1",
        "pricing.basicPlanFeature2"
        // 需要时可继续添加更多
      ]
    },
    pro: {
      monthlySubsequent: 9.9,
      annualSubsequent: 8.25,
      annualTotal: 99,
      annualSaveText: $t("pricing.proAnnualSaveText"),
      features: [
        "pricing.proPlanFeature1",
        "pricing.proPlanFeature2"
        // 需要时可继续添加更多
      ]
    }
  };

  // FAQ 数组
  const faqs = [
    { question: "pricing.faqQ1", answer: "pricing.faqA1" },
    { question: "pricing.faqQ2", answer: "pricing.faqA2" },
    // 如需要更多FAQ，可继续往这里添加
  ];
</script>

<div class="min-h-screen bg-gray-50 py-12">
  <div class="max-w-6xl mx-auto px-4">

    <!-- 页面主标题与副标题 -->
    <h2 class="text-4xl font-extrabold text-center text-gray-800 mb-4">
      {$t("pricing.choosePlanTitle")}
    </h2>
    <p class="text-center text-gray-600 mb-8">
      {$t("pricing.choosePlanDescription")}
    </p>
    <!-- 月/年切换按钮 -->
    <div class="flex justify-center items-center mb-10">
      <span class="mr-3 text-gray-700">{$t("pricing.monthly")}</span>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer" bind:checked={isAnnual} />
        <div
          class="w-14 h-7 bg-gray-300 peer-focus:outline-none 
                 rounded-full peer peer-checked:bg-themegreen
                 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6
                 after:transition-all peer-checked:after:translate-x-[calc(100%+3px)]"
        ></div>
      </label>
      <span class="ml-3 text-gray-700">{$t("pricing.yearly")}</span>
    </div>

    <!-- 定价卡片 (Pro -> Basic -> Free) -->
    <div class="grid md:grid-cols-3 gap-8">

      <!-- pro(Pro)方案放在最前 -->
      <div
        class="relative p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 
               outline-2 outline-themegreen overflow-hidden"
               class:outline="{currentUserPlan === 'pro' || currentUserPlan === 'free'}"
      >
        <!-- 插画或图标，示例放在卡片顶部 -->
        <div class="flex justify-center mb-4">
          <img src={proIcon} alt="Pro Plan Icon" class="h-12" />
        </div>

        <!-- 推荐角标 -->
        <div class="absolute top-0 right-0 bg-themegreen text-white text-xs font-bold py-1 px-3 rounded-bl">
          <!-- 如果 currentUserPlan 为 'pro'，显示 '当前计划'，否则显示 '推荐' -->
          {currentUserPlan === 'pro' ? $t("pricing.current") : $t("pricing.recommended")}
        </div>

        <h3 class="text-2xl font-semibold text-gray-800">
          {$t("pricing.proPlanName")}
        </h3>
        <p class="mt-3 text-gray-600">
          {$t("pricing.proPlanDesc")}
        </p>

        <!-- 价格区块 -->
        {#if !isAnnual}
          <!-- 月付：首月$1 + 之后$9.9 -->
          <p class="mt-5 font-bold text-2xl text-themegreen inline-flex items-center gap-1">
            {$t("pricing.firstMonth")} US$1
            <!-- 特价徽章 -->
            <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {$t("pricing.limitedOffer")}
            </span>
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {$t("pricing.after")} US${pricing.pro.monthlySubsequent}/{$t("pricing.perMonth")}
            ({$t("pricing.save")} 30% {$t("pricing.limitedTime")})
          </p>
        {:else}
          <!-- 年付：首月$1 + 之后$8.25 -->
          <p class="mt-5 font-bold text-2xl text-themegreen inline-flex items-center gap-1">
            {$t("pricing.firstMonth")} US$1
            <!-- 特价徽章 -->
            <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {$t("pricing.limitedOffer")}
            </span>
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {$t("pricing.after")} US${pricing.pro.annualSubsequent}/{$t("pricing.perMonth")} 
            ({$t("pricing.yearlyPay")} US${pricing.pro.annualTotal} 
            {pricing.pro.annualSaveText ? ` (${pricing.pro.annualSaveText})` : ''})
          </p>
        {/if}

        <!-- 功能说明（示例仅用2条，你可以添加更多） -->
        <ul class="mt-6 space-y-4">
          {#each pricing.pro.features as featureKey}
            <li class="flex items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-themegreen mr-2"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              {$t(featureKey)}
            </li>
          {/each}
        </ul>

        <!-- 按钮 -->
        {#if showproButton()}
          <button
            class="w-full mt-6 py-2 bg-themegreen text-white font-semibold rounded-lg hover:opacity-90 transition
              {currentUserPlan === 'basic' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
            disabled={currentUserPlan === 'basic'}
          >
            {getButtonText('pro')}
          </button>
        {/if}
      </div>

      <!-- Basic 方案 -->
      <div
        class="relative p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 outline-2 outline-themegreen overflow-hidden"
               class:outline="{currentUserPlan === 'basic'}"
      >
        <div class="flex justify-center mb-4">
          <!-- 插画/图标 -->
          <img src={basicIcon} alt="Basic Plan Icon" class="h-12" />
        </div>

        {#if currentUserPlan === 'basic'}
          <!-- 推荐角标，仅当 currentUserPlan 为 'basic' 时显示 -->
          <div class="absolute top-0 right-0 bg-themegreen text-white text-xs font-bold py-1 px-3 rounded-bl">
            {$t("pricing.current")}
          </div>
        {/if}

        <h3 class="text-2xl font-semibold text-gray-800">
          {$t("pricing.basicPlanName")}
        </h3>
        <p class="mt-3 text-gray-600">
          {$t("pricing.basicPlanDesc")}
        </p>

        {#if !isAnnual}
          <!-- 月付: 首月$1 + 之后$4.9 -->
          <p class="mt-5 font-bold text-2xl text-themegreen inline-flex items-center gap-1">
            {$t("pricing.firstMonth")} US$1
            <!-- 特价徽章 -->
            <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {$t("pricing.limitedOffer")}
            </span>
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {$t("pricing.after")} US${pricing.basic.monthlySubsequent}/{$t("pricing.perMonth")}
            ({$t("pricing.save")} 20% {$t("pricing.limitedTime")})
          </p>
        {:else}
          <!-- 年付: 首月$1 + 之后$4.08 -->
          <p class="mt-5 font-bold text-2xl text-themegreen inline-flex items-center gap-1">
            {$t("pricing.firstMonth")} US$1
            <!-- 特价徽章 -->
            <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {$t("pricing.limitedOffer")}
            </span>
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {$t("pricing.after")} US${pricing.basic.annualSubsequent}/{$t("pricing.perMonth")}
            ({$t("pricing.yearlyPay")} US${pricing.basic.annualTotal}
            {pricing.basic.annualSaveText ? ` (${pricing.basic.annualSaveText})` : ''})
          </p>
        {/if}

        <ul class="mt-6 space-y-4">
          {#each pricing.basic.features as featureKey}
            <li class="flex items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-themegreen mr-2"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              {$t(featureKey)}
            </li>
          {/each}
        </ul>

        {#if showBasicButton()}
          <button
            class="w-full mt-6 py-2 bg-themegreen text-white font-semibold rounded-lg hover:opacity-90 transition
              {currentUserPlan === 'pro' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}"
            disabled={currentUserPlan === 'pro'}
          >
            {getButtonText('basic')}
          </button>
        {/if}
      </div>

      <!-- Free 方案（放在最后） -->
      <div
        class="relative p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
      >
        <div class="flex justify-center mb-4">
          <!-- 插画/图标 -->
          <img src={freeIcon} alt="Free Plan Icon" class="h-12" />
        </div>

        <h3 class="text-2xl font-semibold text-gray-800">
          {$t("pricing.freePlanName")}
        </h3>
        <p class="mt-3 text-gray-600">
          {$t("pricing.freePlanDesc")}
        </p>
        <p class="mt-5 font-bold text-3xl text-themegreen">US$0</p>
        <ul class="mt-6 space-y-4">
          {#each pricing.free.features as featureKey}
            <li class="flex items-center text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-themegreen mr-2"
                fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              {$t(featureKey)}
            </li>
          {/each}
        </ul>

        <!-- 根据逻辑判断是否显示 -->
        {#if showFreeButton()}
          <button
            class="w-full mt-6 py-2 bg-themegreen text-white font-semibold rounded-lg hover:opacity-90 transition"
            disabled={currentUserPlan === 'free'}
          >
            {$t("pricing.current")}
          </button>
        {/if}
      </div>

    </div>

    <!-- 价格对比说明（新的模块） -->
    <div class="bg-white rounded-lg shadow-lg p-6 mb-10 mt-10 hover:shadow-xl transition">
      <h3 class="text-2xl font-bold text-gray-800 mb-3">
        {$t("pricing.priceComparisonTitle")}
      </h3>
      <p class="text-gray-600 mb-3">
        {$t("pricing.priceComparisonDesc")}
      </p>
      <!-- 这里可以模拟一个简单的三列对比表格，或直接文字描述 -->
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead class="border-b text-gray-700">
            <tr>
              <th class="pb-2">{$t("pricing.priceComparisonService")}</th>
              <th class="pb-2">{$t("pricing.priceComparisonMonthly")}</th>
              <th class="pb-2">{$t("pricing.priceComparisonAnnual")}</th>
            </tr>
          </thead>
          <tbody>
            <!-- GPT 例子 -->
            <tr class="border-b">
              <td class="py-2">{$t("pricing.priceComparisonGPT")}</td>
              <td class="py-2">US$20</td>
              <td class="py-2">US$240</td>
            </tr>
            <!-- Claude 例子 -->
            <tr class="border-b">
              <td class="py-2">{$t("pricing.priceComparisonClaude")}</td>
              <td class="py-2">US$25</td>
              <td class="py-2">US$300</td>
            </tr>
            <!-- Gemini 例子 -->
            <tr class="border-b">
              <td class="py-2">{$t("pricing.priceComparisonGemini")}</td>
              <td class="py-2">US$20</td>
              <td class="py-2">US$240</td>
            </tr>
            <tr>
              <td class="py-2 font-semibold text-themegreen">{$t("pricing.priceComparisonOurPlan")}</td>
              <td class="py-2 font-semibold"><span class="line-through">US$65</span><span class="text-themegreen ml-2">US$1 ~ 9.9</span></td>
              <td class="py-2 font-semibold"><span class="line-through">US$65</span><span class="text-themegreen ml-2">US$49 ~ 99</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-gray-600">
        {$t("pricing.priceComparisonConclusion")}
      </p>
    </div>
    <!-- FAQ 区块 -->
    <div class="mt-12 bg-white p-6 rounded-lg shadow hover:shadow-xl transition">
      <h3 class="text-2xl font-bold text-gray-800 mb-4">
        {$t("pricing.faqTitle")}
      </h3>
      <!-- 常见问题 列表循环 -->
      {#each faqs as item}
        <div class="mb-4">
          <div class="font-semibold text-gray-700 mb-2">
            {$t(item.question)}
          </div>
          <p class="text-gray-600">
            {$t(item.answer)}
          </p>
        </div>
      {/each}
    </div>
  </div>
</div>
