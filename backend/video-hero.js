// ========== ВИДЕО В HERO-БЛОКАХ: без зацикливания, реплей только при возврате к блоку ==========
document.addEventListener('DOMContentLoaded', function () {
    const videos = document.querySelectorAll('.video-hero .video-bg');
    if (!videos.length) return;

    const FADE_MS = 700;

    function getFadeEl(video) {
        // Прозрачность анимируем на обёртке, а не на самом <video> —
        // так надёжнее работает во всех браузерах/движках рендеринга.
        return video.closest('.video-bg-wrap') || video;
    }

    function fadeIn(video) {
        getFadeEl(video).style.opacity = '1';
    }

    function fadeOutThenPause(video) {
        getFadeEl(video).style.opacity = '0';
        clearTimeout(video._pauseTimeout);
        video._pauseTimeout = setTimeout(function () {
            video.pause();
        }, FADE_MS);
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const video = entry.target;
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                clearTimeout(video._pauseTimeout);
                getFadeEl(video).style.opacity = '0';

                const playAndFadeIn = function () {
                    video.play().catch(function () {});
                    // Двойной rAF — гарантируем, что opacity:0 отрисован до перехода в opacity:1
                    requestAnimationFrame(function () {
                        requestAnimationFrame(function () {
                            fadeIn(video);
                        });
                    });
                };

                // Ждём фактического перехода на начало ролика (seeked),
                // чтобы под затуханием не мелькнул старый кадр.
                if (video.readyState >= 1) {
                    video.addEventListener('seeked', function onSeeked() {
                        video.removeEventListener('seeked', onSeeked);
                        playAndFadeIn();
                    });
                    video.currentTime = 0;
                } else {
                    video.currentTime = 0;
                    playAndFadeIn();
                }
            } else {
                fadeOutThenPause(video);
            }
        });
    }, { threshold: [0, 0.5, 1] });

    videos.forEach(function (video) {
        video.muted = true;
        video.playsInline = true;
        observer.observe(video);
    });
});
