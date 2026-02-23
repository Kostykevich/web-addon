// content.js

// На странице поиска Google
if (window.location.hostname.includes("google.com") && window.location.search.includes("site%3Akinogo")) {
    window.addEventListener('load', () => {
        const firstLink = document.querySelector('a[href^="https://kinogo.online/filmy/"]');
        if (firstLink) {
            console.log("[Kinogo Extension] Переходим на первую ссылку:", firstLink.href);

            // Переходим по ссылке
            window.location.href = firstLink.href;
        } else {
            console.log("[Kinogo Extension] Ссылка не найдена");
        }
    });
}

// Google search page + наш маркер
if (
    window.location.hostname.includes("google.") &&
    window.location.search.includes("#ext_data:assistant")
) {
    console.log("[Assistant] Google detected");
    console.log("[Assistant] URL:", location.href);

    const isGoodLink = (href) => {
        if (!href) return false;

        return (
            href.startsWith("http") &&
            !href.includes("google.") &&
            !href.includes("accounts.google") &&
            !href.includes("support.google") &&
            !href.includes("policies.google") &&
            !href.includes("/search?")
        );
    };

    const tryFindLink = () => {
        const links = Array.from(document.querySelectorAll("a"));

        console.log("[Assistant] Всего ссылок:", links.length);

        for (let i = 0; i < links.length; i++) {
            const href = links[i].href;

            console.log(`[Assistant] Проверка ${i}:`, href);

            if (isGoodLink(href)) {
                console.log("[Assistant] ✔ Найдена подходящая ссылка:", href);
                window.location.href = href;
                return true;
            }
        }

        console.log("[Assistant] ❌ Подходящая ссылка пока не найдена");
        return false;
    };

    // пробуем сразу
    if (!tryFindLink()) {
        // Google часто подгружает DOM позже
        const observer = new MutationObserver(() => {
            if (tryFindLink()) observer.disconnect();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// На сайте kinogo.online
if (window.location.hostname.includes("kinogo.online")) {
    window.addEventListener('load', () => {
        if (!document.referrer.includes("google.com")) {
            console.log("[Kinogo Extension] Переход не с Google, ничего не делаем");
            return;
        }

        const scrollToPlayer = async () => {
            const playerContainer = document.querySelector('.js-player-container');
            if (playerContainer) {
                console.log("[Kinogo Extension] Скроллим к плееру");
                playerContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

                setTimeout(async () => {
                    console.log("[Kinogo Extension] Отправляем запрос на сервер для кликов");
                    try {
                        const response = await fetch("http://127.0.0.1:5000/play_film");
                        const data = await response.json();
                        console.log("[Kinogo Extension] Сервер ответил:", data);
                    } catch (e) {
                        console.error("[Kinogo Extension] Ошибка при вызове сервера:", e);
                    }
                }, 2000);

            } else {
                console.log("[Kinogo Extension] Плеер не найден, повтор через 1 сек...");
                setTimeout(scrollToPlayer, 1000);
            }
        };

        scrollToPlayer();
    });
}
