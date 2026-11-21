

function handleSocialLogin(provider) {
    localStorage.setItem("userEmail", `${provider.toLowerCase()}_user@eruliaf.com`);
    localStorage.setItem("userPassword", "social_auth");
    window.location.href = "dashboard.html";
}

function handleSocialRegister(provider) {
    handleSocialLogin(provider);
}