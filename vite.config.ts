import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	 logLevel: 'info',
	 server: {
	   host: '0.0.0.0', // 监听所有网络接口
	   port: 5173,       // 你想要的端口
	   allowedHosts: [
		'www.uugpt.com',  // 将此域名添加到允许的列表中
		'localhost',      // 也可以添加其他你信任的域名
		'127.0.0.1'
	  ]
	 },

});
