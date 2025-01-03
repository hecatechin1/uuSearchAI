<script>
    // 独立的开关状态
    let isBasicAnnual = false; // 基础套餐是否切换到按年订阅
    let isPremiumAnnual = false; // 高级套餐是否切换到按年订阅
  
    const pricing = {
      free: {
        monthly: { price: "US$0", description: "Free Plan" },
        annual: { price: "US$0", description: "Free Plan" },
        features: [
          "每日40次基础模型访问 (GPT-4o mini, Claude 3 Haiku)",
          "基础模型驱动的智能写作、翻译和总结",
        ],
      },
      basic: {
        monthly: { price: "US$7.9", discountPrice: "US$4.9" },
        annual: { price: "US$94.8", discountPrice: "US$49.0", discountText: "Save 48%" },
        features: [
          "每月5000次基础模型访问 (GPT-4o mini, Claude 3 Haiku)",
          "每月200次高级模型访问 (o1-preview, Claude 3.5, Gemini 1.5 Pro)",
        ],
      },
      premium: {
        monthly: { price: "US$14.9", discountPrice: "US$9.9" },
        annual: { price: "US$179", discountPrice: "US$99.0", discountText: "Save 45%" },
        features: [
          "无限次基础模型访问 (GPT-4o mini, Claude 3 Haiku)",
          "无限次高级模型访问 (o1-preview, Claude 3.5, Gemini 1.5 Pro)",
        ],
      },
    };
  </script>
  
  <div class="max-w-6xl mx-auto px-6 py-12">
    <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">选择合适的订阅计划</h2>
  
    <div class="grid md:grid-cols-3 gap-6">
      <!-- 高级套餐 -->
      <div class="border p-6 rounded-lg shadow-lg bg-white relative">
        <h3 class="text-2xl font-semibold text-gray-800">高级套餐</h3>
        <p class="mt-4 text-gray-600">适合高需求用户，提供所有功能。</p>
  
        <p class="mt-4 font-bold text-2xl text-blue-600">
          {isPremiumAnnual
            ? pricing.premium.annual.discountPrice
            : pricing.premium.monthly.discountPrice}
        </p>
        <p class="text-gray-500 text-sm line-through">
          {isPremiumAnnual
            ? pricing.premium.annual.price
            : pricing.premium.monthly.price}
        </p>
  
        <!-- 年度订阅开关 -->
        <div class="flex items-center mt-4">
          <label class="flex items-center cursor-pointer">
            <span class="text-gray-600 mr-4">按月订阅</span>
            <div class="relative">
              <input type="checkbox" class="sr-only" bind:checked={isPremiumAnnual} />
              <div class="block bg-gray-300 w-14 h-8 rounded-full"></div>
              <div
                class="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform"
                class:bg-blue-500="{isPremiumAnnual}"
                style:transform="{isPremiumAnnual ? 'translateX(100%)' : 'translateX(0)'}"
              ></div>
            </div>
            <span class="text-gray-600 ml-4">按年订阅</span>
          </label>
          {#if isPremiumAnnual}
            <span class="ml-4 text-sm text-red-500">{pricing.premium.annual.discountText}</span>
          {/if}
        </div>
  
        <!-- 功能说明 -->
        <ul class="mt-6 space-y-4">
          {#each pricing.premium.features as feature}
            <li class="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          {/each}
        </ul>
  
        <button class="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          选择高级套餐
        </button>
      </div>
  
      <!-- 基础套餐 -->
      <div class="border p-6 rounded-lg shadow-lg bg-white relative">
        <h3 class="text-2xl font-semibold text-gray-800">基础套餐</h3>
        <p class="mt-4 text-gray-600">适合中小型项目和个人用户。</p>
  
        <p class="mt-4 font-bold text-2xl text-blue-600">
          {isBasicAnnual
            ? pricing.basic.annual.discountPrice
            : pricing.basic.monthly.discountPrice}
        </p>
        <p class="text-gray-500 text-sm line-through">
          {isBasicAnnual
            ? pricing.basic.annual.price
            : pricing.basic.monthly.price}
        </p>
  
        <!-- 年度订阅开关 -->
        <div class="flex items-center mt-4">
          <label class="flex items-center cursor-pointer">
            <span class="text-gray-600 mr-4">按月订阅</span>
            <div class="relative">
              <input type="checkbox" class="sr-only" bind:checked={isBasicAnnual} />
              <div class="block bg-gray-300 w-14 h-8 rounded-full"></div>
              <div
                class="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transition-transform"
                class:bg-blue-500="{isBasicAnnual}"
                style:transform="{isBasicAnnual ? 'translateX(100%)' : 'translateX(0)'}"
              ></div>
            </div>
            <span class="text-gray-600 ml-4">按年订阅</span>
          </label>
          {#if isBasicAnnual}
            <span class="ml-4 text-sm text-red-500">{pricing.basic.annual.discountText}</span>
          {/if}
        </div>
  
        <!-- 功能说明 -->
        <ul class="mt-6 space-y-4">
          {#each pricing.basic.features as feature}
            <li class="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          {/each}
        </ul>
  
        <button class="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          选择基础套餐
        </button>
      </div>
  
      <!-- 免费计划 -->
      <div class="border p-6 rounded-lg shadow-lg bg-white">
        <h3 class="text-2xl font-semibold text-gray-800">免费计划</h3>
        <p class="mt-4 text-gray-600">{pricing.free.monthly.description}</p>
        <p class="mt-4 font-bold text-2xl text-blue-600">{pricing.free.monthly.price}</p>
  
        <!-- 功能说明 -->
        <ul class="mt-6 space-y-4">
          {#each pricing.free.features as feature}
            <li class="flex items-center text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
              {feature}
            </li>
          {/each}
        </ul>
  
        <button class="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          开始免费试用
        </button>
      </div>
    </div>
  </div>
  