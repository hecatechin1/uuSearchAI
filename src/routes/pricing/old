<script>
    import { onMount } from 'svelte';
    import pricingBg from '../../assets/home/bg.png';
    import uuGPTLogo from '../../assets/aianswer-avtar.svg';
    import freeIcon from '../../assets/pricing/free-icon.svg';
    import basicIcon from '../../assets/pricing/basic-icon.svg';
    import standardIcon from '../../assets/pricing/standard-icon.svg';
    import premiumIcon from '../../assets/pricing/premium-icon.svg';
    import payAsYouGoIcon from '../../assets/pricing/pay-as-you-go-icon.svg';

    let annualBilling = false;

    const pricingPlans = [
        {
            "name": "Free Tier",
            "monthly_price": 0,
            "annual_price": 0,
            "original_price": 0,
            "discounted_price": 0,
            "icon": freeIcon,
            "features": [
                "Daily 5000 tokens",
                "Access to GPT-4o mini",
                "No File interaction",
            ]
        },
        {
            "name": "Basic Subscription",
            "monthly_price": 3,
            "annual_price": 30,
            "original_price": 5,
            "discounted_price": 3,
            "icon": basicIcon,
            "features": [
                "Access to GPT-4o mini, GPT-3.5 Turbo, Claude 3.5 Haiku",
                "10 PDF interactions per month",
                "Usage limits during peak times",
                "$1 referral bonus"
            ]
        },
        {
            "name": "Standard Subscription",
            "monthly_price": 10,
            "annual_price": 100,
            "original_price": 15,
            "discounted_price": 10,
            "icon": standardIcon,
            "features": [
                "Unlimited text generation",
                "100 PDF interactions per month",
                "Unlimited Voice interaction (200 minutes cap)",
                "Priority customer support"
            ]
        },
        {
            "name": "Premium Subscription",
            "monthly_price": 20,
            "annual_price": 200,
            "original_price": 30,
            "discounted_price": 20,
            "icon": premiumIcon,
            "features": [
                "Unlimited access to the latest models",
                "Unlimited PDF and Voice interactions",
                "Priority during peak times",
                "Custom system role settings",
                "24/7 priority support"
            ]
        },
        {
            "name": "Pay-As-You-Go",
            "monthly_price": "Based on usage",
            "annual_price": "Based on usage",
            "original_price": "Based on usage",
            "discounted_price": "Based on usage",
            "icon": payAsYouGoIcon,
            "features": [
                "$1 recharge for 1 million tokens",
                "Flexible usage options with multiple models",
                "Pricing per model/token" 
            ],
            "pricing_details": {
                "models": [
                    { "name": "GPT-4o mini", "price_per_1000_tokens": 0.01, "price_per_million_tokens": 10 },
                    { "name": "GPT-3.5 turbo", "price_per_1000_tokens": 0.01, "price_per_million_tokens": 10 },
                    { "name": "GPT-4o", "price_per_1000_tokens": 0.05, "price_per_million_tokens": 50 },
                    { "name": "GPT-4 turbo", "price_per_1000_tokens": 0.1, "price_per_million_tokens": 100 },
                    { "name": "Claude 3.5 Haiku", "price_per_1000_tokens": 0.01, "price_per_million_tokens": 10 },
                    { "name": "Claude 3.5 Sonnet", "price_per_1000_tokens": 0.05, "price_per_million_tokens": 50 },
                    { "name": "Claude 3.5 Opus", "price_per_1000_tokens": 0.2, "price_per_million_tokens": 200 }
                ]
            }
        }
    ];
</script>

<main class="min-h-screen bg-gray-100">
    <!-- Header Section -->
    <header class="bg-white shadow">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <img src="/assets/aianswer-avtar.svg" alt="uuGPT Logo" class="w-10 h-10">
                <h1 class="text-2xl font-bold">uuGPT</h1>
            </div>
            <nav class="space-x-4">
                <a href="/" class="text-gray-700 hover:text-teal-600">Home</a>
                <a href="/pricing" class="text-gray-700 hover:text-teal-600">Pricing</a>
                <a href="https://docs.google.com/forms/d/e/1FAIpQLScVS4s36Oys7ylHPNNaT3fg6BUtY3HHSfbu27GIOsFmOhUGzw/viewform" class="text-gray-700 hover:text-teal-600">Feedback</a>
            </nav>
        </div>
    </header>

    <!-- Pricing Hero Section -->
    <section class="text-white py-20" style="background-image: url({pricingBg}); background-size: cover; background-position: center;">
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-bold mb-4">Flexible Pricing Plans</h2>
            <p class="mb-8">Choose a plan that fits your needs, from casual use to professional AI integration.</p>
            <div class="flex items-center justify-center mb-4">
                <label class="text-lg font-semibold mr-2">Monthly</label>
                <div class="relative inline-flex items-center mr-2">
                    <input type="checkbox" bind:checked={annualBilling} class="hidden" id="billingToggle" />
                    <label for="billingToggle" class="w-14 h-8 bg-gray-300 rounded-full cursor-pointer relative">
                        <span class="absolute w-6 h-6 bg-white rounded-full transition-transform" style:transform={`translateX(${annualBilling ? '30px' : '0'})`}></span>
                    </label>
                </div>
                <label class="text-lg font-semibold">Annual (Save 20%)</label>
            </div>
            <p class="text-sm italic text-gray-300">Get 2 months free with annual billing!</p>
        </div>
    </section>

    <!-- Pricing Plans Section -->
    <section id="pricing" class="py-20">
        <div class="container mx-auto px-6">
            <h2 class="text-3xl font-bold text-center mb-12">Our Pricing Plans</h2>
            <div class="grid md:grid-cols-3 gap-10">
                {#each pricingPlans as plan}
                    <div class="bg-white shadow-lg p-8 rounded-lg text-center hover:shadow-xl transition-transform transform hover:-translate-y-2">
                        <img src={plan.icon} alt="{plan.name} Icon" class="w-16 h-16 mx-auto mb-4" />
                        <h3 class="text-2xl font-bold mb-4">{plan.name}</h3>
                        <p class="text-gray-600 mb-6 text-lg">
                            ${annualBilling ? plan.annual_price : plan.monthly_price} per {annualBilling ? 'year' : 'month'}
                        </p>
                        <ul class="mb-6">
                            {#each plan.features as feature}
                                <li class="flex items-center justify-start mb-2">
                                    <svg class="w-6 h-6 text-teal-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.75-7.75a.75.75 0 01.6-1.4l1.1.33 3.56-4.44a.75.75 0 111.18.96l-4 5a.75.75 0 01-.89.27l-2-1z" clip-rule="evenodd"></path></svg>
                                    {feature}
                                </li>
                            {/each}
                        </ul>
                        <button class="bg-teal-600 text-white py-2 px-4 rounded-full hover:bg-teal-700 transition-transform transform hover:scale-105">
                            {plan.name === "Free Tier" ? "Get Started" : "Subscribe Now"}
                        </button>
                        {#if plan.name !== "Free Tier" && plan.name !== "Pay-As-You-Go"}
                            <p class="mt-4 text-red-500 font-semibold">Limited Time Discount Available!</p>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    </section>
</main>

<style>
    main {
        padding: 2rem;
    }
</style>
