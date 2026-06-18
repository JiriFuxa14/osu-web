# osu! Web Presentation

## 1. Úvod
**Název projektu:** osu! Web Presentation
**Téma:** Komplexní průvodce rytmickou hrou osu! včetně osobních zkušeností hráče.
**Živý web:** https://jirifuxa14.github.io/osu-web/

## 2. Použité technologie
Tento projekt byl vytvořen striktně za pomoci "čistých" webových technologií bez použití jakýchkoliv CSS frameworků (Tailwind, Bootstrap) nebo JS frameworků (React, Vue).
- **HTML5** (Sémantické značky)
- **CSS3** (Flexbox, CSS Grid, CSS Variables)
- **Vanilla JavaScript** (ES6+, Intersection Observer)
- **IDE:** Libovolný editor, doporučeno Visual Studio Code

## 3. Adresářová struktura
```text
osu-web/
│
├── index.html          # Hlavní a jediná HTML stránka (One-Pager)
├── README.md           # Tato technická dokumentace projektu
├── css/
│   └── style.css       # Kompletní kaskádové styly projektu
└── js/
    └── main.js         # JavaScriptová logika (fade-in animace při scrollování)
```

## 4. Technický rozbor a Optimalizace

### A. Výkon (Performance)
**Teorie:** Cílem optimalizace výkonu bylo minimalizovat zátěž na uživatelův prohlížeč a snížit velikost stahovaných dat. Toho bylo dosaženo přesunem logiky do externích souborů (cachování), preloadem fontů a využitím *lazy loadingu* (líného načítání) pro těžké prvky, jako je vložený YouTube přehrávač. Kód není minifikován záměrně, aby zůstal čistý a plně čitelný pro hodnocení této školní práce, nicméně v reálném nasazení by se využila automatická minifikace (např. do `style.min.css` a `main.min.js`).

**Code snippet:**
```html
<!-- Ukázka líného načítání u YouTube iframe -->
<iframe loading="lazy" width="560" height="315" src="..."></iframe>
```
*Vysvětlení:* Atribut `loading="lazy"` říká prohlížeči, aby iframe s videem stáhl a vykreslil až v momentě, kdy se uživatel k této sekci přiblíží scrollováním (přiblíží se k viewportu). Radikálně se tím šetří úvodní HTTP požadavky.

### B. SEO (Search Engine Optimization)
**Teorie:** Web využívá přísně sémantické tagování HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`), což vyhledávačům umožňuje přesně analyzovat obsah. Byly definovány meta tagy pro popis a klíčová slova.

**Code snippet:**
```html
<meta name="description" content="Komplexní průvodce rytmickou hrou osu! Zjistěte, jak hrát, objevte různé typy map a přečtěte si zkušenosti skutečných hráčů.">
```
*Vysvětlení:* Meta tag `description` je pro SEO zásadní. Poskytuje shrnutí obsahu stránky, které se obvykle zobrazuje ve výsledcích vyhledávání (SERP). Kvalitní popis přímo ovlivňuje proklikovost (CTR).

### C. Přístupnost (Accessibility - WCAG)
**Teorie:** Pro zpřístupnění obsahu uživatelům se zrakovým znevýhodněním (čtečky obrazovek) jsme u důležitých funkčních prvků, kde samotný text nestačí k pochopení kontextu, využili ARIA atributy. Dále byl kladen důraz na extrémně vysoký kontrast textu (bílá) vůči pozadí (černá a tmavě fialová).

**Code snippet:**
```html
<a href="https://osu.ppy.sh/home" class="btn primary-btn" aria-label="Přejít na oficiální web hry osu!">
    Zaregistruj se a hraj osu!
</a>
```
*Vysvětlení:* Atribut `aria-label` poskytuje skrytý a velmi přesný kontext pro čtečky obrazovky.

### D. Sociální sítě (Open Graph & X Cards)
**Teorie:** Aby web vypadal profesionálně při sdílení v chatech a na sociálních sítích, obsahuje HTML hlavička sadu meta tagů Open Graph (pro Facebook, Discord) a Twitter (X) Cards.

**Code snippet:**
```html
<meta property="og:title" content="osu! - Tvůj průvodce rytmickým šílenstvím">
<meta name="twitter:card" content="summary_large_image">
```
*Vysvětlení:* Tyto parametry vnucují crawlerům platforem přesný nadpis, typ karty a odkaz, což zabraňuje náhodnému vyzobávání textu ze stránky.

### E. UI/UX (User Interface / User Experience)
**Teorie:** Layout využívá metodologii Mobile First. Byl postaven kompletně na CSS Gridu a Flexboxu, takže je flexibilní pro všechny obrazovky. Design čerpá z estetiky hry "osu!" – využívá "glassmorphism" efekt (rozmazané poloprůhledné pozadí) u navigace, tmavý režim (Dark Theme) a interaktivní plynulé vznášení prvků.

**Code snippet:**
```css
/* Ukázka responzivního flexibilního gridu pro karty (sekce Co je osu!) */
.mechanics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}
```
*Vysvětlení:* Konstrukce `repeat(auto-fit, minmax(...))` automaticky vytváří tolik sloupců, kolik se jich aktuálně vejde na obrazovku, přičemž dodržuje minimální šířku 280 pixelů pro čitelnost. Nahrazuje tak zdlouhavé psaní @media queries.

### F. AI Integrace (Využití umělé inteligence)
**Teorie:** Do projektu byla zapojena AI ve formě asistenta během vývoje kódu a generování textového obsahu. AI zpracovala osobní příběh uživatele a strukturovala ho do atraktivních sekcí na webu. Dále pomohla s návrhem responsivního CSS gridu.

**Code snippet:**
```css
/* Řešení pro flexibilní karty vygenerované s pomocí AI */
.mechanics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}
```

## 5. AI Deník
Seznam promtů a využití AI v projektu:

1. **Zpracování neuspořádaných myšlenek do profi textu**
   - **Prompt (Uživatel):** *"takže já začnu že osu jsem poprvý hrál v lednu 2025... z 640K na 598K do konce února... tablet od kamaráda ale vůbec s ním neumím..."*
   - **Přínos AI:** AI tento surový blok textu rozebrala, opravila stylistiku a rozdělila jej do přehledných karet (sekce "Zkušenost hráče: Cesta k top 500K" a "Herní Setup").

2. **Generování CSS Grid struktury bez frameworků**
   - **Prompt (Implicitní z našeho chatu):** Vytvoř moderní layout, který bude responzivní, ale dodrží podmínku Vanilla CSS bez Tailwindu.
   - **Přínos AI:** Vygenerování efektivního `auto-fit` gridu a "glassmorphism" vizuálu pro hlavičku, které dodaly webu velmi prémiový a moderní vzhled.

## 6. Instalace a spuštění (Lokální server)
1. Stáhněte/naklonujte tento repozitář do počítače.
2. Otevřete adresář v editoru **Visual Studio Code**.
3. Do editoru si nainstalujte rozšíření **Live Server**.
4. V levém menu klikněte pravým tlačítkem na soubor `index.html` a zvolte **"Open with Live Server"**.
5. Web se automaticky otevře ve vašem prohlížeči (zpravidla na adrese `http://127.0.0.1:5500`).

## 7. Galerie (Screenshots)
*(Až si web spustíte, pořiďte screenshoty a nahraďte tyto zástupné texty za reálné obrázky na vašem GitHubu)*
- ![Screenshot Desktop Verze](img/desktop.png)
- ![Screenshot Mobilní Verze](img/mobile.png)
