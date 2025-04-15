// 确保在浏览器环境中运行
window.self_deferredPrompt = 'test';
if (typeof window !== 'undefined') {
    console.log('----')
    window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        window.self_deferredPrompt = event;
    });

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        console.log('应用已成功安装');
    });
}
