import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	 logLevel: 'info',
	 server: {
	   host: '0.0.0.0', // 监听所有网络接口
	   port: 5173,       // 你想要的端口
	 }
});
