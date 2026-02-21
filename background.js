// background.js
const PORT = 48123;

self.addEventListener("fetch", event => {
    const url = new URL(event.request.url);

    if (url.hostname === "127.0.0.1" && url.port === PORT.toString()) {
        if (url.pathname === "/ping_assistant_jarvis") {
            event.respondWith(
                new Response(
                    JSON.stringify({
                        extension: "assistant-extension",
                        installed: true,
                        version: "1.0.0"
                    }),
                    {
                        headers: { "Content-Type": "application/json" }
                    }
                )
            );
        }
    }
});