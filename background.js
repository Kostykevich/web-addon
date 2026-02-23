// background.js (V3 Service Worker)

const PORT = 48123;

// Отправка ping при установке/запуске расширения
async function sendPing() {
    try {
        const res = await fetch(`http://127.0.0.1:${PORT}/ping_extension`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ installed: true, version: "1.0.0" })
        });
        await res.json(); // Можно не сохранять, просто ждём ответа
    } catch {
        // ничего не делаем, если сервер недоступен
    }
}

chrome.runtime.onInstalled.addListener(sendPing);
chrome.runtime.onStartup.addListener(sendPing);

// Отслеживание посещённых страниц
chrome.webNavigation.onCompleted.addListener((details) => {
    const url = details.url;
    if (!url || url.startsWith("chrome://") || url.startsWith("file://")) return;

    fetch(`http://127.0.0.1:${PORT}/page_visited`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, timestamp: Date.now() })
    }).catch(() => {}); // пустой catch
}, { url: [{ schemes: ["http", "https"] }] });