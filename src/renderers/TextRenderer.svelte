<script>
    export let text;
    
    // 使用浏览器原生解码方法
    const decodeEntities = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };
</script>

{@html decodeEntities(text || '')}