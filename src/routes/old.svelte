<script>
    import userIcon1 from "../assets/home/user1.png";
    import userIcon2 from "../assets/home/user2.png";
    import userIcon3 from "../assets/home/user3.png";
    import featurePic1 from "../assets/home/feature1.png";
    import featurePic2 from "../assets/home/feature2.png";
    import uugpIcon from "../assets/aianswer-avtar.svg";
    import bgImage from "../assets/home/bg.png";

</script>
  
  <main class="min-h-screen bg-gray-100">
    <!-- Header Section -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <!-- Logo Icon -->
          <img src={uugpIcon} alt="uuGPT Logo" class="w-10 h-10">
          <h1 class="text-2xl font-bold">uuGPT</h1>
        </div>
        <nav class="space-x-4">
          <a href="#features" class="text-gray-700 hover:text-teal-600">Features</a>
          <a href="https://www.maxask.com/s/?q=hello?" class="text-gray-700 hover:text-teal-600">Free Trial</a>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLScVS4s36Oys7ylHPNNaT3fg6BUtY3HHSfbu27GIOsFmOhUGzw/viewform" class="text-gray-700 hover:text-teal-600">Feedback</a>
        </nav>
      </div>
    </header>
  
    <!-- Hero Section -->
    <section 
        class="text-white py-20" 
        style="background-image: url({bgImage}); background-size: cover; background-position: center;"
        >
        <div class="container mx-auto px-6 text-center">
            <h2 class="text-4xl font-bold mb-4">Powerful AI Assistant</h2>
            <p class="mb-8">Leading AI models (GPT, Claude, Gemini, etc.) to power your chat, search, writing & coding needs.</p>
            <button 
            class="bg-white text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            on:click={() => window.location.href = "https://www.maxask.com/s/?q=hello?"}>
            Try for Free
            </button>
            <p class="mt-4 text-sm">Limited time free trial, no registration required!</p>
        </div>
    </section>
  
    <!-- Core Features Section -->
    <section id="features" class="py-20">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center mb-12">Core Features</h2>
        <div class="grid md:grid-cols-2 gap-10">
          <div class="bg-white shadow p-6 text-center rounded-lg">
            <img src={featurePic1} alt="Text Generation" class="bg-gray-300 rounded w-full mb-6" style="background-color: #eee;">
            <h3 class="font-semibold text-xl mb-2">Text Generation</h3>
            <p>Generate high-quality text with our advanced GPT models, ideal for content creation, summaries, and more.</p>
          </div>
          <div class="bg-white shadow p-6 text-center rounded-lg">
            <img src={featurePic2} alt="Model Selection" class="bg-gray-300 rounded w-full mb-6" style="background-color: #eee;">
            <h3 class="font-semibold text-xl mb-2">Model Selection</h3>
            <p>Choose from a range of models to suit your needs, providing flexibility and control over AI capabilities.</p>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Testimonials Section -->
    <section class="bg-gray-100 py-20">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold mb-12">What Our Users Say</h2>
        <div class="grid md:grid-cols-3 gap-10">
          <div class="bg-white shadow p-6 rounded-lg">
            <img src={userIcon1} alt="User Image" class="bg-gray-300 rounded-full w-20 h-20 mx-auto mb-4" style="background-color: #eee;">
            <p class="mb-4">“UUGPT's text generation capabilities have transformed my workflow!”</p>
            <h3 class="font-semibold">John Doe</h3>
            <span class="text-sm text-gray-600">Content Creator</span>
          </div>
          <div class="bg-white shadow p-6 rounded-lg">
            <img src={userIcon3} alt="User Image" class="bg-gray-300 rounded-full w-20 h-20 mx-auto mb-4" style="background-color: #eee;">
            <p class="mb-4">“The ability to select models is a game-changer for customizing results.”</p>
            <h3 class="font-semibold">Jane Smith</h3>
            <span class="text-sm text-gray-600">Product Manager</span>
          </div>
          <div class="bg-white shadow p-6 rounded-lg">
            <img src={userIcon2} alt="User Image" class="bg-gray-300 rounded-full w-20 h-20 mx-auto mb-4" style="background-color: #eee;">
            <p class="mb-4">“Free to try, great way to search!”</p>
            <h3 class="font-semibold">Ray Jackson</h3>
            <span class="text-sm text-gray-600">Programmer</span>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Call to Action Section -->
    <section class="bg-teal-600 text-white py-20 text-center">
      <h2 class="text-3xl font-bold mb-6">Ready to Experience uuGPT?</h2>
      <button 
        class="bg-white text-teal-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
        on:click={() => window.location.href = "https://www.maxask.com/s/?q=hello?"}>
        Get started now!
      </button>
      <br />
      <button 
        id="feedback" 
        class="mt-6 text-white underline"
        on:click={() => window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLScVS4s36Oys7ylHPNNaT3fg6BUtY3HHSfbu27GIOsFmOhUGzw/viewform"}>
        Give us your feedback
      </button>
    </section>
  </main>
  