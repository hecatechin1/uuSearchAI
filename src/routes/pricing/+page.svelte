<script lang="ts">
  import { t } from "svelte-i18n"; // 导入本地化方法
  import freeIcon from "../../assets/pricing/free-icon.svg";
  import basicIcon from "../../assets/pricing/basic-icon.svg";
  import proIcon from "../../assets/pricing/pro-icon.svg";
  import saleIcon from "../../assets/pricing/sale.svg";
  import saleRedIcon from "../../assets/pricing/sale_red.svg";
  import { goto } from "$app/navigation";
  import {
    getPaymentAddress,
    getPlanManageAddress,
  } from "../../manages/planManages";
  import {
    showErrorMessage,
    showSuccessMessage,
  } from "../../stores/globalParamentStores";
  import {
    userID,
    userPlanEndtime,
    userPlanMode,
    userSubMode,
  } from "../../stores/userStores";
  import { isLogin } from "../../stores/globalParamentStores";
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import {
    getUserInfo,
    userLoginForMaxthon,
  } from "../../manages/userinfoManages";

  import { getCookieValue } from "../../utils/generalUtils";
  // 是否按年订阅
  let isAnnual = true;

  // 当前用户的方案，可能是  'free' | 'basic' | 'pro'
  let currentUserPlan: string = "free";
  let isLoaded = false;
  let showCard_pro = true;
  let showCard_Basic = true;
  let showCard_free = true;
  let showYearlybutton = true;
  onMount(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let urlParameter = urlParams.get("mxcallback");
    // if (urlParameter != null) {
    //   await userLoginForMaxthon();
    // }
    if (getCookieValue("MXTOKEN") != null || urlParameter!= null) {
      await userLoginForMaxthon();
    }
    let res = getUserInfo();
    res.then((res) => {});

    isLogin.subscribe((value) => {
      if (value) {
        let plan = get(userPlanMode);
        currentUserPlan = plan.split("_")[1];
        isAnnual = plan.split("_")[2] === "monthly" ? false : true;
        cardControler();
      }
      isLoaded = true;
    });
  });

  function cardControler() {
    if (currentUserPlan === "free") {
      showCard_pro = true;
      showCard_Basic = true;
      showCard_free = true;
      showYearlybutton = true;
    } else if (currentUserPlan === "basic") {
      showCard_free = false;
      showCard_pro = false;
      showYearlybutton = false;
    } else if (currentUserPlan === "pro") {
      showCard_free = false;
      showCard_Basic = false;
      showYearlybutton = false;
    }
  }

  // 按钮文字
  function getButtonText(plan: string): string {
    console.log(plan, currentUserPlan);
    return currentUserPlan === plan
      ? $t("pricing.currentPlan")
      : $t("pricing.selectPlan");
  }

  // pricing数据
  // 将 feature 的翻译键储存在 features 数组中，后面用 #each 渲染
  const pricing = {
    free: {
      features: $t("pricing.freePlanFeatures"),
    },
    basic: {
      monthlySubsequent: 4.9, // 月付之后的价格
      annualSubsequent: 4.08, // 年付折算月价
      annualTotal: 49,
      annualSaveText: $t("pricing.basicAnnualSaveText"),
      features: $t("pricing.basicPlanFeatures"),
    },
    pro: {
      monthlySubsequent: 9.9,
      annualSubsequent: 8.25,
      annualTotal: 99,
      annualSaveText: $t("pricing.proAnnualSaveText"),
      features: $t("pricing.proPlanFeatures"),
    },
  };

  // FAQ 数组
  const faqs = [
    { question: "pricing.faqQ1", answer: "pricing.faqA1" },
    { question: "pricing.faqQ2", answer: "pricing.faqA2" },
    // 如需要更多FAQ，可继续往这里添加
  ];

  async function planManage() {
    let data = await getPlanManageAddress();

    window.open(data, "_blank");
  }
  async function pay(plan: string) {
    let data = await getPaymentAddress(plan, isAnnual);
    if (data != 0) {
      showErrorMessage($t("pricing.paymentLinkError",{default: "Payment link error"}));
    }
    window.location.href = data;
    showSuccessMessage($t("pricing.paymentProcessing",{default: "Payment processing..."}));
  }
  function basicbtnAct() {
    if (currentUserPlan === "basic") {
      planManage();
    } else {
      pay("uugpt_basic" + (isAnnual ? "_yearly" : ""));
    }
  }

  function probtnAct() {
    if (currentUserPlan === "pro") {
      planManage();
    } else {
      pay("uugpt_pro" + (isAnnual ? "_yearly" : ""));
    }
  }
  function back2Chat() {
    goto("/chat");
  }
</script>

{#if isLoaded}
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="max-w-6xl mx-auto px-4">
      <!-- 页面主标题与副标题 -->
      {#if currentUserPlan != "pro" && currentUserPlan != "basic"}
        <h2 class="text-4xl font-extrabold text-center text-gray-800 mb-4">
          {$t("pricing.choosePlanTitle")}
        </h2>
        <p class="text-center text-gray-600 mb-8">
          {$t("pricing.choosePlanDescription")}
        </p>

        <!-- 月/年切换按钮 -->
        <div class="flex justify-center items-center mb-10">
          <span
            class="mr-3 text-gray-500 transition-all duration-300 ease-in-out"
            class:text-xl={!isAnnual}
            class:font-bold={!isAnnual}
            class:text-themegreen={!isAnnual}>{$t("pricing.monthly")}</span
          >
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              class="sr-only peer"
              bind:checked={isAnnual}
            />
            <div
              class="w-14 h-7 bg-gray-300 peer-focus:outline-none
                 rounded-full peer peer-checked:bg-themegreen
                 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                 after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6
                 after:transition-all peer-checked:after:translate-x-[calc(100%+3px)]"
            ></div>
          </label>
          <span
            class="ml-3 text-gray-500 transition-all duration-300 ease-in-out"
            class:text-xl={isAnnual}
            class:font-bold={isAnnual}
            class:text-themegreen={isAnnual}>{$t("pricing.yearly")}</span
          >
        </div>
      {:else}
        <h2 class="text-4xl font-extrabold text-center text-gray-800 mb-4">
          {$t("pricing.planTiltle")}
        </h2>
        <p class="text-center text-gray-600 mb-8">
          {$t("pricing.planDescription")}
        </p>
      {/if}

      <!-- 定价卡片 (Pro -> Basic -> Free) -->
      <div
        class="grid md:grid-cols-3 auto-cols-auto gap-4 justify-center transition-all duration-300 ease-in-out"
      >
        {#if showCard_pro}
          <!-- pro(Pro)方案放在最前 -->
          <div
            class="relative flex flex-col rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 transform
               outline outline-0 outline-themegreen overflow-hidden"
          >
            <!-- 推荐角标 -->
            {#if currentUserPlan != "pro"}
              <div
                class="absolute top-0 right-0 bg-themegreen text-white font-bold py-1 px-3 rounded-bl-lg"
              >
                {$t("pricing.recommended")}
              </div>
            {/if}

            <!-- 方案名称 -->
            <div class="px-5 pt-10 pb-6 border-b border-gray-200">
              <h3 class="text-2xl font-semibold text-gray-800">
                <span>{$t("pricing.proPlanName")}</span>
                <span
                  ><img
                    class="inline-block h-6"
                    src={saleRedIcon}
                    alt={$t("pricing.specialPrice")}
                  /></span
                >
              </h3>
              <p class="mt-3 text-gray-600">
                {$t("pricing.proPlanDesc")}
              </p>
            </div>

            <div class="px-5 bg-gray-50 py-6 flex-1 text-left">
              <!-- 价格区块 -->

              <!-- 月付：首月$1 + 之后$9.9 -->
              <div class="flex items-end gap-4 font-bold pb-3">
                <div class="flex flex-col">
                  <h5 class="text-themegreen text-lg ml-1">
                    {$t("pricing.firstMonth")}
                  </h5>
                  <h3
                    class="text-6xl text-themegreen inline-flex items-center gap-1"
                  >
                    $1
                  </h3>
                </div>

                {#if !isAnnual}
                  <div class="flex flex-col text-sm text-gray-700 mt-1">
                    <p class="">
                      {$t("pricing.after")}
                      {$t("pricing.monthly")}
                    </p>
                    <p>USD ${pricing.pro.monthlySubsequent}</p>
                    <p class="text-gray-400">
                      {$t("pricing.yearlyPay")} ${pricing.pro.annualSubsequent} /
                      {$t("pricing.perMonth")}
                    </p>
                  </div>
                {:else}
                  <div class="flex flex-col text-sm text-gray-700 mt-1">
                    <p class="">
                      {$t("pricing.after")}
                      {$t("pricing.yearly")}
                    </p>
                    <p>
                      USD ${pricing.pro.annualSubsequent} {$t(
                        "pricing.perMonth",
                      )}
                    </p>
                    <p class="text-gray-400">
                      {$t("pricing.priceTotal")} ${pricing.pro.annualTotal} USD
                    </p>
                  </div>
                {/if}
              </div>

              <!-- 按钮 -->
              <button
                on:click={probtnAct}
                class="w-full mt-6 py-2 bg-themegreen text-white font-semibold rounded-lg hover:opacity-90 transition
              {currentUserPlan === 'basic'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'}"
                disabled={currentUserPlan === "basic"}
              >
                {getButtonText("pro")}
              </button>

              <!-- 功能说明（示例仅用2条，你可以添加更多） -->
              <ul class="mt-10 space-y-3 font-medium mb-3">
                {#each pricing.pro.features as featureKey}
                  <li class="flex items-center text-gray-700 ml-1">
                    {$t(featureKey)}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}

        {#if showCard_Basic}
          <!-- Basic 方案 -->
          <div
            class="relative flex flex-col rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 transform
               outline outline-2 outline-gray-50 overflow-hidden"
          >
            <!-- 方案名称 -->
            <div class="px-5 pt-10 pb-6 border-b border-gray-200">
              <h3 class="text-2xl font-semibold text-gray-800">
                <span>{$t("pricing.basicPlanName")}</span>
                <span
                  ><img
                    class="inline-block h-6"
                    src={saleIcon}
                    alt={$t("pricing.specialPrice")}
                  /></span
                >
              </h3>
              <p class="mt-3 text-gray-600">
                {$t("pricing.basicPlanDesc")}
              </p>
            </div>

            <div class="px-5 bg-gray-50 py-6 flex-1 text-left">
              <!-- 价格区块 -->

              <!-- 月付：首月$1 + 之后$9.9 -->
              <div class="flex items-end gap-4 font-bold pb-3">
                <div class="flex flex-col">
                  <h5 class="text-themegreen text-lg ml-1">
                    {$t("pricing.firstMonth")}
                  </h5>
                  <h3
                    class="text-6xl text-themegreen inline-flex items-center gap-1"
                  >
                    $1
                  </h3>
                </div>

                {#if !isAnnual}
                  <div class="flex flex-col text-sm text-gray-700 mt-1">
                    <p class="">
                      {$t("pricing.after")}
                      {$t("pricing.monthly")}
                    </p>
                    <p>USD ${pricing.basic.monthlySubsequent}</p>
                    <p class="text-gray-400">
                      {$t("pricing.yearlyPay")} ${pricing.basic
                        .annualSubsequent} / {$t("pricing.perMonth")}
                    </p>
                  </div>
                {:else}
                  <div class="flex flex-col text-sm text-gray-700 mt-1">
                    <p class="">
                      {$t("pricing.after")}
                      {$t("pricing.yearly")}
                    </p>
                    <p>
                      USD ${pricing.basic.annualSubsequent} /{$t(
                        "pricing.perMonth",
                      )}
                    </p>
                    <p class="text-gray-400">
                      总计 ${pricing.basic.annualTotal} USD
                    </p>
                  </div>
                {/if}
              </div>

              <!-- 按钮 -->
              <button
                on:click={basicbtnAct}
                class="w-full mt-6 py-2 bg-themegreen text-white font-semibold rounded-lg hover:opacity-90 transition
              {currentUserPlan === 'pro'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'}"
                disabled={currentUserPlan === "pro"}
              >
                {getButtonText("basic")}
              </button>
              <!-- 功能说明（示例仅用2条，你可以添加更多） -->
              <ul class="mt-10 space-y-3 font-medium mb-3">
                {#each pricing.basic.features as featureKey}
                  <li class="flex items-center text-gray-700 ml-1">
                    {$t(featureKey)}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}

        {#if showCard_free}
          <!-- Free 方案（放在最后） -->
          <div
            class="relative flex flex-col rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300 transform
             outline outline-2 outline-gray-50 overflow-hidden"
          >
            <!-- 方案名称 -->
            <div class="px-5 pt-10 pb-6 border-b border-gray-200">
              <h3 class="text-2xl font-semibold text-gray-800">
                <span>{$t("pricing.freePlanName")}</span>
              </h3>
              <p class="mt-3 text-gray-600">
                {$t("pricing.freePlanDesc")}
              </p>
            </div>

            <div class="px-5 bg-gray-50 py-6 flex-1 text-left">
              <!-- 价格区块 -->

              <div class="flex items-end gap-4 font-bold pb-3">
                <div class="flex flex-col">
                  <h5 class="text-themegreen text-lg ml-1">
                    {$t("pricing.current")}
                  </h5>
                  <h3
                    class="text-6xl text-themegreen inline-flex items-center gap-1"
                  >
                    $0
                  </h3>
                </div>
              </div>

              <!-- 按钮 -->
              <button
                on:click={back2Chat}
                class="w-full mt-6 py-2 bg-gray-300 text-white font-semibold rounded-lg hover:opacity-90 transition"
              >
                {$t("pricing.current")}
              </button>
              <!-- 功能说明（示例仅用2条，你可以添加更多） -->
              <ul class="mt-10 space-y-3 font-medium mb-3">
                {#each pricing.free.features as featureKey}
                  <li class="flex items-center text-gray-700 ml-1">
                    {$t(featureKey)}
                  </li>
                {/each}
              </ul>
            </div>
          </div>
        {/if}
      </div>

      <!-- 价格对比说明（新的模块） -->
      <div
        class="bg-white rounded-lg shadow-lg p-6 mb-10 mt-10 hover:shadow-xl transition"
      >
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
                <td class="py-2 font-semibold text-themegreen"
                  >{$t("pricing.priceComparisonOurPlan")}</td
                >
                <td class="py-2 font-semibold"
                  ><span class="line-through">US$65</span><span
                    class="text-themegreen ml-2">US$1 ~ 9.9</span
                  ></td
                >
                <td class="py-2 font-semibold"
                  ><span class="line-through">US$65</span><span
                    class="text-themegreen ml-2">US$49 ~ 99</span
                  ></td
                >
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mt-3 text-gray-600">
          {$t("pricing.priceComparisonConclusion")}
        </p>
      </div>
      <!-- FAQ 区块 -->
      <div
        class="mt-12 bg-white p-6 rounded-lg shadow hover:shadow-xl transition"
      >
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
{/if}
