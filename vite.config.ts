import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
	plugins: [sveltekit()],
	 logLevel: 'info',
	 server: {
	   host: 'www.uugpt.com', // 监听所有网络接口
	   port: 443,       // 你想要的端口
	   https:{
		key: fs.readFileSync('./ssl/_wildcard.uugpt.com-key.pem'),  // 证书的私钥文件路径
		cert: fs.readFileSync('./ssl/_wildcard.uugpt.com.pem'),  // 证书文件路径
	   }
	 },
});