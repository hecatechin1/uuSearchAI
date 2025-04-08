// const CLIENT_ID = "111015791863-mvevc0jau39k9mrocfisr6cn9nr39pqj.apps.googleusercontent.com";


function handleCredentialResponse(response) {
    console.log("接收到 Google ID Token:", response.credential);

    // 示例：发送到你后端验证
    fetch("https://api.uugpt.com/user/verify-google-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token: response.credential })
    })
        .then(res => res.json())
        .then(data => {
            // window.location.href = '/chat';
        });
}