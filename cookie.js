

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function getToken() {
    const FALLBACK = "c2stVlROVU5Gc0tzSmQ5RTZuaGVqNHdUM0JsaWtiRkp2TUZnZ05JTEREVFdTa0tWeUpp";
    const savedToken = getCookie("OPENAI_API_KEY");

    if (savedToken) {
        OPENAI_API_KEY = savedToken;
    } else {
        const token = prompt("Please enter your OpenAI API token:", "");

        if (token !== null && token !== "") {
            OPENAI_API_KEY = token;
            setCookie("OPENAI_API_KEY", OPENAI_API_KEY, 30); // Save the token for 30 days
        } else {
            OPENAI_API_KEY = atob(FALLBACK);
        }
    }
}

getToken();
