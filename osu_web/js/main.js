// Hlavní interaktivita webu - Vanilla JS

document.addEventListener("DOMContentLoaded", () => {

    // 1. Intersection Observer pro plynulé Fade-In efekty (Lazy animace)
    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15, // Spustí se, když je zobrazeno alespoň 15% prvku
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 2. Osu! Background Canvas a Audio / Pulzování
    const canvas = document.getElementById("osu-canvas");
    const ctx = canvas.getContext("2d");
    const logo = document.getElementById("osu-logo");

    // Audio Context a proměnné pro Web Audio API
    let audioCtx = null;
    let analyser = null;
    let bgMusicSource = null;
    let bgMusic = null;
    let dataArray = null;
    let bufferLength = 0;
    let audioInitialized = false;

    // Nastavení velikosti canvasu
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Konfigurace pulzování pro simulovaný režim
    let bpm = 130;
    let beatInterval = 60000 / bpm;
    let lastBeat = Date.now();
    let logoActiveScale = 1;

    // Spuštění zvukových efektů (click)
    function playClickSound() {
        try {
            const clickSfx = new Audio("click.sfx.mp3");
            clickSfx.volume = 1.0; // Plná hlasitost clicku (proti hudbě na pozadí vynikne)
            clickSfx.play().catch(e => console.log("SFX play failed:", e));
        } catch (e) {
            console.error("SFX error:", e);
        }
    }

    // Inicializace pozadí (hudby)
    function initAudio() {
        if (audioInitialized) return;
        audioInitialized = true; // Zabraňujeme vícenásobnému volání

        // Vytvoříme audio element pro hudbu na pozadí
        bgMusic = new Audio();
        bgMusic.src = "bg_musik.mp3";
        bgMusic.loop = true;
        bgMusic.volume = 0.4; // Zvýšeno pro lepší slyšitelnost
        bgMusic.preload = "auto";
        // bgMusic.crossOrigin = "anonymous"; // Zakomentováno, protože to může způsobovat ztlumení zvuku na lokálním Live Serveru

        // Zkusíme propojit s Web Audio API (pro live visualizer)
        let webAudioWorking = false;
        try {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            // Pokud je context suspendovaný, resumeme
            if (audioCtx.state === "suspended") {
                audioCtx.resume();
            }

            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            bufferLength = analyser.frequencyBinCount;
            dataArray = new Uint8Array(bufferLength);

            bgMusicSource = audioCtx.createMediaElementSource(bgMusic);
            bgMusicSource.connect(analyser);
            analyser.connect(audioCtx.destination);
            webAudioWorking = true;
            console.log("Web Audio API + analyser connected OK");
        } catch (e) {
            console.warn("Web Audio API selhalo, visualizer poběží v simulovaném režimu:", e);
            analyser = null;
        }

        // Přehrajeme hudbu rovnou (musí to být synchronní s mousedown eventem, jinak to prohlížeč zablokuje)
        bgMusic.play().then(() => {
            console.log("BG music is playing, volume:", bgMusic.volume, "webAudio:", webAudioWorking);
        }).catch(err => {
            console.error("BG music play() rejected:", err);
        });
    }

    // Reakce loga při stisku (pouze vizuální zmenšení)
    logo.addEventListener("mousedown", () => {
        logoActiveScale = 0.93;
    });

    logo.addEventListener("mouseup", () => {
        logoActiveScale = 1.0;
    });

    logo.addEventListener("mouseleave", () => {
        logoActiveScale = 1.0;
    });

    // Povolení click zvuků a spuštění hudby explicitně při kliknutí na tlačítko
    const musicBtn = document.getElementById("music-toggle");
    if (musicBtn) {
        musicBtn.addEventListener("click", () => {
            playClickSound();
            if (!audioInitialized) {
                initAudio();
            } else if (audioCtx && audioCtx.state === "suspended") {
                audioCtx.resume();
            }
            // Schovat tlačítko po zapnutí
            musicBtn.style.display = "none";
        });
    }

    // Pro jistotu necháme i kliknutí na logo
    logo.addEventListener("click", () => {
        playClickSound();
        if (!audioInitialized) {
            initAudio();
        } else if (audioCtx && audioCtx.state === "suspended") {
            audioCtx.resume();
        }
    });

    // Třída pro plovoucí trojúhelníky v pozadí
    class Triangle {
        constructor() {
            this.reset(true);
        }

        reset(randomY = false) {
            this.size = Math.random() * 45 + 15;
            this.x = Math.random() * canvas.width;
            this.y = randomY ? Math.random() * canvas.height : canvas.height + this.size;
            this.speed = Math.random() * 0.7 + 0.3;
            this.opacity = Math.random() * 0.12 + 0.03;
            this.angle = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.008;
        }

        update() {
            this.y -= this.speed;
            this.angle += this.rotationSpeed;
            if (this.y < -this.size) {
                this.reset(false);
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.moveTo(0, -this.size / 2);
            ctx.lineTo(this.size / 2, this.size / 2);
            ctx.lineTo(-this.size / 2, this.size / 2);
            ctx.closePath();
            ctx.fillStyle = `rgba(255, 102, 170, ${this.opacity})`;
            ctx.fill();
            ctx.restore();
        }
    }

    const triangles = Array.from({ length: 45 }, () => new Triangle());

    const numBars = 120;
    const barHeights = new Array(numBars).fill(0);

    // Hlavní smyčka animací
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Pohyb a vykreslení trojúhelníků
        triangles.forEach(t => {
            t.update();
            t.draw();
        });

        // Výpočet pozice loga
        const logoRect = logo.getBoundingClientRect();
        const heroRect = canvas.parentElement.getBoundingClientRect();
        const centerX = logoRect.left + logoRect.width / 2 - heroRect.left;
        const centerY = logoRect.top + logoRect.height / 2 - heroRect.top;
        const radius = logoRect.width / 2 + 6;

        // 2. Rozvětvení logiky podle toho, zda již analyzujeme reálnou hudbu
        if (audioInitialized && analyser) {
            analyser.getByteFrequencyData(dataArray);

            // Výpočet síly basů pro pulzování loga (prvních 12 binů reprezentuje basy)
            let bassSum = 0;
            let bassCount = 12;
            for (let i = 0; i < bassCount; i++) {
                bassSum += dataArray[i];
            }
            let averageBass = bassSum / bassCount;
            let bassRatio = averageBass / 255;

            // Nelineární zvětšení pro větší šmrnc pulzu
            let pulseScale = 1.0 + 0.08 * Math.pow(bassRatio, 1.6);
            let finalScale = pulseScale * logoActiveScale;
            logo.style.transform = `translate(-50%, -50%) scale(${finalScale})`;

            // Aktualizace paprsků visualizeru z reálných zvukových dat
            for (let i = 0; i < numBars; i++) {
                // Symetrické rozvržení (levá a pravá strana zrcadlově)
                let symIndex = i < numBars / 2 ? i : numBars - 1 - i;
                // Zaměříme se na spodní a střední pásmo spektra (kde je většina hudby)
                let dataIndex = Math.floor((symIndex / (numBars / 2)) * (bufferLength * 0.6));
                let val = dataArray[dataIndex] || 0;

                let targetHeight = (val / 255) * 45;
                // Plynulé vyhlazení
                barHeights[i] += (targetHeight - barHeights[i]) * 0.22;
            }
        } else {
            // Režim před spuštěním - simulovaný puls
            let now = Date.now();
            let timeSinceBeat = now - lastBeat;
            if (timeSinceBeat >= beatInterval) {
                lastBeat = now - (timeSinceBeat % beatInterval);
                timeSinceBeat = 0;
            }

            let progress = timeSinceBeat / beatInterval;
            let pulseIntensity = Math.exp(-progress * 4.5);
            let pulseScale = 1.0 + 0.06 * pulseIntensity;
            let finalScale = pulseScale * logoActiveScale;
            logo.style.transform = `translate(-50%, -50%) scale(${finalScale})`;

            // Simulované pohyby visualizeru
            for (let i = 0; i < numBars; i++) {
                let base = pulseIntensity * 16;
                let noise = Math.random() * 6;
                let wave = Math.sin((i / numBars) * Math.PI * 4) * 8 + 6;

                let targetHeight = base + noise + wave;
                barHeights[i] += (targetHeight - barHeights[i]) * 0.15;
            }
        }

        // 3. Vykreslení visualizeru
        for (let i = 0; i < numBars; i++) {
            const angle = (i / numBars) * Math.PI * 2;
            const height = barHeights[i];

            const startX = centerX + Math.cos(angle) * radius;
            const startY = centerY + Math.sin(angle) * radius;

            const endX = centerX + Math.cos(angle) * (radius + height);
            const endY = centerY + Math.sin(angle) * (radius + height);

            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);

            ctx.lineWidth = Math.min(canvas.width * 0.0025, 2.5);
            ctx.lineCap = "round";
            ctx.strokeStyle = `rgba(255, 102, 170, ${0.15 + (height / 40) * 0.45})`;
            ctx.stroke();
        }

        requestAnimationFrame(animate);
    }

    animate();
});
