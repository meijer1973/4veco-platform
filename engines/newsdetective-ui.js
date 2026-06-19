/**
 * NEWS-DETECTIVE-V2-PROTOTYPE-REPLACEMENT-1
 *
 * DOM binding layer for the V2 Nieuws-detective shell. The page structure and
 * visual system are fixture-owned; this adapter only connects
 * NEWS_DETECTIVE_DATA and NewsDetectiveEngine to the V2 controls.
 */
(function () {
    "use strict";

    var data = window.NEWS_DETECTIVE_DATA;
    if (!data) {
        console.error("newsdetective-ui.js: NEWS_DETECTIVE_DATA not found");
        return;
    }
    if (!window.NewsDetectiveEngine) {
        console.error("newsdetective-ui.js: NewsDetectiveEngine not found");
        return;
    }

    var engine = new NewsDetectiveEngine(data);
    var app = document.getElementById("nd-app");
    if (!app) {
        console.error("newsdetective-ui.js: #nd-app not found");
        return;
    }

    var currentRound = null;
    var chainSelection = [];
    var roundStates = [null, null, null, null];

    var els = {
        progressRail: document.getElementById("progressRail"),
        themeToggle: document.getElementById("themeToggle"),
        startBtn: document.getElementById("startBtn"),
        startTitle: document.getElementById("startTitle"),
        startArticle: document.getElementById("startArticle"),
        gameArticle: document.getElementById("gameArticle"),
        roundCard: document.getElementById("roundCard"),
        resultCard: document.getElementById("resultCard"),
        screens: {
            start: document.getElementById("screen-start"),
            game: document.getElementById("screen-game"),
            result: document.getElementById("screen-result")
        }
    };

    applyDomainTokens();
    initTheme();
    initContent();
    bindEvents();
    updateProgress(0);
    showScreen("start");

    function applyDomainTokens() {
        var colors = engine.getDomainColors() || {};
        var root = document.documentElement;
        if (colors.primary) root.style.setProperty("--accent", colors.primary);
        if (colors.primaryLt) root.style.setProperty("--accent-soft", colors.primaryLt);
        if (colors.accent) root.style.setProperty("--econ", colors.accent);
    }

    function initTheme() {
        try {
            var saved = localStorage.getItem("newsDetectiveV2Theme");
            if (saved === "dark" || saved === "light") {
                document.documentElement.setAttribute("data-theme", saved);
            }
        } catch (e) {
            // Theme persistence is optional; the page still works without storage.
        }
    }

    function setTheme(next) {
        document.documentElement.setAttribute("data-theme", next);
        try {
            localStorage.setItem("newsDetectiveV2Theme", next);
        } catch (e) {
            // Ignore blocked storage.
        }
    }

    function toggleTheme() {
        var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        setTheme(current === "dark" ? "light" : "dark");
    }

    function initContent() {
        var article = engine.getArticle();
        if (els.startTitle) els.startTitle.textContent = article.headline || "Nieuws-detective";
        if (els.startArticle) {
            els.startArticle.innerHTML = renderArticleCard(article, {
                heading: "h2",
                kicker: "Economisch nieuws",
                aria: "Nieuwsartikel"
            });
        }
        if (els.gameArticle) {
            els.gameArticle.innerHTML = renderArticleCard(article, {
                heading: "h3",
                kicker: "Dossier - blijft leesbaar",
                aria: "Nieuwsartikel blijft leesbaar"
            });
        }
    }

    function bindEvents() {
        if (els.themeToggle) els.themeToggle.addEventListener("click", toggleTheme);
        if (els.startBtn) els.startBtn.addEventListener("click", startGame);
        if (els.roundCard) {
            els.roundCard.addEventListener("click", function (event) {
                var target = event.target.closest("[data-action]");
                if (!target || target.disabled || target.classList.contains("disabled")) return;
                var action = target.getAttribute("data-action");
                if (action === "concept") answerConcept(Number(target.getAttribute("data-index")));
                else if (action === "chain-place") placeChain(Number(target.getAttribute("data-index")));
                else if (action === "chain-remove") removeFromSlot(Number(target.getAttribute("data-slot")));
                else if (action === "chain-submit") submitChain();
                else if (action === "model") answerModel(target.getAttribute("data-id"));
                else if (action === "error") answerError(target.getAttribute("data-phrase"));
                else if (action === "reset-round") resetRound();
                else if (action === "next-round") advanceRound();
            });
        }
        if (els.resultCard) {
            els.resultCard.addEventListener("click", function (event) {
                var replay = event.target.closest("[data-action='replay']");
                if (replay) startGame();
            });
        }
    }

    function startGame() {
        engine.startGame();
        currentRound = null;
        chainSelection = [];
        roundStates = [null, null, null, null];
        showScreen("game");
        advanceRound();
    }

    function advanceRound() {
        chainSelection = [];
        var hasRound = engine.nextRound();
        if (!hasRound) {
            showResultScreen();
            return;
        }
        currentRound = engine.getRound();
        renderRound();
    }

    function showResultScreen() {
        var result = engine.getResult();
        updateProgress(null, result.perRound);
        if (els.resultCard) els.resultCard.innerHTML = renderResult(result);
        showScreen("result");
    }

    function renderRound() {
        if (!currentRound || !els.roundCard) return;
        chainSelection = [];
        updateProgress(currentRound.roundNumber - 1);

        var html = '<div class="round-head">'
            + '<span class="round-badge">Ronde ' + currentRound.roundNumber + ' &middot; ' + esc(currentRound.typeName) + '</span>'
            + '<span class="score">Score ' + currentScore() + '/4</span>'
            + '</div>'
            + '<h2>' + esc(currentRound.question || "") + '</h2>';

        if (currentRound.type === "concept") html += renderConceptRound();
        else if (currentRound.type === "consequence") html += renderConsequenceRound();
        else if (currentRound.type === "model") html += renderModelRound();
        else if (currentRound.type === "error") html += renderErrorRound();

        html += '<div class="feedback" id="feedback"></div>'
            + '<div class="actions">'
            + (currentRound.type === "consequence"
                ? '<button class="btn btn-secondary" type="button" data-action="reset-round">Reset ronde</button>'
                : "")
            + '<button class="btn btn-primary" type="button" id="nextBtn" data-action="next-round" style="display:none">Volgende ronde &rarr;</button>'
            + '</div>';

        els.roundCard.innerHTML = html;
    }

    function resetRound() {
        if (!currentRound) return;
        var roundIndex = currentRound.roundNumber - 1;
        if (roundStates[roundIndex] !== null) return;
        renderRound();
    }

    function renderConceptRound() {
        var letters = ["A", "B", "C", "D"];
        return '<div class="options">'
            + currentRound.options.map(function (option, index) {
                return '<button class="option" type="button" data-action="concept" data-index="' + index + '">'
                    + '<span class="letter">' + letters[index] + '</span>'
                    + '<span>' + esc(option.text) + '</span>'
                    + '</button>';
            }).join("")
            + '</div>';
    }

    function answerConcept(index) {
        var result = engine.submitAnswer(index);
        qa(".option", els.roundCard).forEach(function (button, i) {
            button.disabled = true;
            if (result.correctAnswer && i === result.correctAnswer.index) button.classList.add("correct");
            if (i === index && !result.correct) button.classList.add("wrong");
        });
        finishRound(result);
    }

    function renderConsequenceRound() {
        return '<p>Klik de blokken in de juiste volgorde. Klik op een gevuld vak om dat blok te verwijderen.</p>'
            + '<div class="chain-zone">'
            + '<div><div class="chain-label">Beschikbare blokken</div>'
            + '<div class="chain-pool">'
            + currentRound.items.map(function (item, index) {
                return '<button class="chain-block" type="button" data-action="chain-place" data-index="' + index + '">' + esc(item.text) + '</button>';
            }).join("")
            + '</div></div>'
            + '<div><div class="chain-label">Jouw keten</div>'
            + '<div class="chain-slots">'
            + range(currentRound.requiredCount).map(function (slot) {
                return '<button class="chain-slot" type="button" data-action="chain-remove" data-slot="' + slot + '">' + (slot + 1) + '</button>';
            }).join("")
            + '</div></div>'
            + '</div>'
            + '<div class="actions">'
            + '<button class="btn btn-warning" type="button" id="checkChain" data-action="chain-submit" disabled>Controleer keten</button>'
            + '</div>';
    }

    function placeChain(index) {
        if (chainSelection.length >= currentRound.requiredCount) return;
        var block = q('.chain-block[data-index="' + index + '"]', els.roundCard);
        if (!block || block.classList.contains("placed")) return;
        chainSelection.push({ index: index, text: currentRound.items[index].text });
        block.classList.add("placed");
        updateChainSlots();
    }

    function removeFromSlot(slotIndex) {
        if (slotIndex < 0 || slotIndex >= chainSelection.length) return;
        var removed = chainSelection.splice(slotIndex, 1)[0];
        var block = q('.chain-block[data-index="' + removed.index + '"]', els.roundCard);
        if (block) block.classList.remove("placed");
        updateChainSlots();
    }

    function updateChainSlots() {
        qa(".chain-slot", els.roundCard).forEach(function (slot, index) {
            var item = chainSelection[index];
            if (item) {
                slot.textContent = item.text;
                slot.classList.add("filled");
                slot.setAttribute("data-text", item.text);
            } else {
                slot.textContent = String(index + 1);
                slot.classList.remove("filled");
                slot.removeAttribute("data-text");
            }
        });
        var submit = q("#checkChain", els.roundCard);
        if (submit) submit.disabled = chainSelection.length !== currentRound.requiredCount;
    }

    function submitChain() {
        if (chainSelection.length !== currentRound.requiredCount) return;
        var selected = chainSelection.map(function (item) { return item.text; });
        var result = engine.submitAnswer(selected);
        var correctChain = result.correctAnswer && result.correctAnswer.chain ? result.correctAnswer.chain : [];

        qa(".chain-block", els.roundCard).forEach(function (block) {
            block.classList.add("disabled");
            block.disabled = true;
        });
        qa(".chain-slot", els.roundCard).forEach(function (slot, index) {
            slot.disabled = true;
            slot.classList.add("disabled");
            var text = slot.getAttribute("data-text");
            if (text && correctChain[index] === text) slot.classList.add("correct");
            else if (text) slot.classList.add("wrong");
        });
        var submit = q("#checkChain", els.roundCard);
        if (submit) submit.style.display = "none";
        finishRound(result);
    }

    function renderModelRound() {
        return '<div class="model-grid">'
            + currentRound.options.map(function (option) {
                return '<button class="model-card" type="button" data-action="model" data-id="' + escAttr(option.id) + '">'
                    + '<strong>' + esc(option.label) + '</strong>'
                    + '<p>' + esc(option.description) + '</p>'
                    + '</button>';
            }).join("")
            + '</div>';
    }

    function answerModel(id) {
        var result = engine.submitAnswer(id);
        qa(".model-card", els.roundCard).forEach(function (button) {
            button.disabled = true;
            var cardId = button.getAttribute("data-id");
            if (result.correctAnswer && cardId === result.correctAnswer.id) button.classList.add("correct");
            if (cardId === id && !result.correct) button.classList.add("wrong");
        });
        finishRound(result);
    }

    function renderErrorRound() {
        var html = '<div class="analysis-box">' + renderClickableAnalysis(currentRound.fakeAnalysis, currentRound.phrases) + '</div>'
            + '<p>Klik op de fout in de analyse.</p>';
        return html;
    }

    function renderClickableAnalysis(text, phrases) {
        var placeholders = {};
        var marked = String(text || "");
        phrases.slice().sort(function (a, b) { return b.length - a.length; }).forEach(function (phrase, index) {
            var token = "\u0000PHRASE_" + index + "\u0000";
            placeholders[token] = phrase;
            marked = marked.replace(phrase, token);
        });
        return marked.split(/(\u0000PHRASE_\d+\u0000)/).map(function (part) {
            var phrase = placeholders[part];
            if (!phrase) return esc(part);
            return '<button class="phrase" type="button" data-action="error" data-phrase="' + escAttr(phrase) + '">' + esc(phrase) + '</button>';
        }).join("");
    }

    function answerError(phrase) {
        var result = engine.submitAnswer(phrase);
        qa(".phrase", els.roundCard).forEach(function (button) {
            button.disabled = true;
            var value = button.getAttribute("data-phrase");
            if (result.correctAnswer && value === result.correctAnswer.phrase) button.classList.add("correct");
            else if (value === phrase && !result.correct) button.classList.add("wrong");
        });
        finishRound(result);
    }

    function finishRound(result) {
        var roundIndex = currentRound.roundNumber - 1;
        roundStates[roundIndex] = result.correct;
        updateProgress(roundIndex);
        var reset = q("[data-action='reset-round']", els.roundCard);
        if (reset) {
            reset.disabled = true;
            reset.style.display = "none";
        }
        showFeedback(result);
    }

    function showFeedback(result) {
        var feedback = q("#feedback", els.roundCard);
        if (!feedback) return;
        feedback.className = "feedback" + (result.correct ? "" : " wrong");
        feedback.innerHTML = '<strong>' + (result.correct ? "Goed gezien." : "Niet helemaal.") + '</strong>'
            + '<p>' + esc(result.feedback) + '</p>'
            + (result.lesLink ? '<p class="feedback-link">' + esc(result.lesLink) + '</p>' : "");
        feedback.style.display = "block";

        var next = q("#nextBtn", els.roundCard);
        if (next) {
            next.style.display = "inline-flex";
            next.textContent = engine.isGameOver() ? "Bekijk resultaat" : "Volgende ronde \u2192";
        }
        var score = q(".score", els.roundCard);
        if (score) score.textContent = "Score " + result.score + "/4";
    }

    function renderResult(result) {
        var deg = result.ratio * 360;
        var message;
        if (result.score === 4) message = "Uitstekend. Je leest het nieuws als econoom.";
        else if (result.score >= 2) message = "Goede basis. Kijk terug naar de rondes waar de redenering brak.";
        else message = "Nog oefenen. Begin opnieuw en gebruik het artikel als bewijs.";

        return '<p class="eyebrow">Onderzoek afgerond</p>'
            + '<h2>Score: ' + result.score + '/' + result.total + '</h2>'
            + '<div class="score-ring" style="--score-deg:' + deg + 'deg"><span>' + result.score + '/' + result.total + '</span></div>'
            + '<div class="result-breakdown">'
            + result.perRound.map(function (round, index) {
                return '<div class="result-row">'
                    + '<strong>Ronde ' + (index + 1) + '</strong>'
                    + '<span>' + esc(round.typeName) + '</span>'
                    + '<span>' + (round.correct ? "Goed" : "Nog oefenen") + '</span>'
                    + '</div>';
            }).join("")
            + '</div>'
            + '<p>' + esc(message) + '</p>'
            + '<div class="actions" style="justify-content:center">'
            + '<button class="btn btn-secondary" type="button" data-action="replay">Opnieuw</button>'
            + '<a class="btn btn-primary" href="index.html">Terug naar paragraaf</a>'
            + '</div>';
    }

    function renderArticleCard(article, options) {
        options = options || {};
        var heading = options.heading || "h2";
        var kicker = options.kicker || "Economisch nieuws";
        var aria = options.aria || "Nieuwsartikel";
        var source = article.source || "Bron";
        var sourceDate = article.sourceDate || "";
        var sourceHtml = article.sourceUrl
            ? '<a href="' + escAttr(article.sourceUrl) + '" target="_blank" rel="noopener">' + esc(source) + '</a>'
            : '<span>' + esc(source) + '</span>';
        return '<article class="article-card" aria-label="' + escAttr(aria) + '">'
            + '<div class="article-kicker">' + esc(kicker) + '</div>'
            + '<div class="article-meta"><span>' + sourceHtml + '</span><span>' + esc(sourceDate) + '</span></div>'
            + '<' + heading + '>' + esc(article.headline) + '</' + heading + '>'
            + '<p class="article-body" data-article-body="full">' + esc(article.body) + '</p>'
            + renderFacts(article)
            + '</article>';
    }

    function renderFacts(article) {
        if (!Array.isArray(article.facts) || article.facts.length === 0) return "";
        var facts = article.facts.map(function (fact) {
            var strong = fact && (fact.value || fact.title || fact.label || fact.strong || fact.key || "");
            var detail = fact && (fact.detail || fact.caption || fact.text || fact.description || fact.span || "");
            if (!strong && !detail) return "";
            return '<div class="fact"><strong>' + esc(strong) + '</strong><span>' + esc(detail) + '</span></div>';
        }).filter(Boolean).join("");
        return facts ? '<div class="article-facts">' + facts + '</div>' : "";
    }

    function updateProgress(activeIndex, finalRounds) {
        if (!els.progressRail) return;
        var labels = ["Concept", "Gevolg", "Model", "Fout"];
        els.progressRail.innerHTML = labels.map(function (label, index) {
            var state = finalRounds ? finalRounds[index].correct : roundStates[index];
            var cls = "";
            var status = "straks";
            if (state === true) {
                cls = " done";
                status = "klaar";
            } else if (state === false) {
                cls = " wrong";
                status = "herhaal";
            } else if (index === activeIndex) {
                cls = " active";
                status = "nu";
            }
            return '<div class="round-row' + cls + '">'
                + '<div class="round-dot">' + (index + 1) + '</div>'
                + '<div><strong>' + label + '</strong><br><span>Ronde ' + (index + 1) + '</span></div>'
                + '<span class="status-pill">' + status + '</span>'
                + '</div>';
        }).join("");
    }

    function showScreen(name) {
        Object.keys(els.screens).forEach(function (key) {
            if (els.screens[key]) els.screens[key].classList.toggle("active", key === name);
        });
    }

    function currentScore() {
        return roundStates.filter(function (state) { return state === true; }).length;
    }

    function q(selector, ctx) {
        return (ctx || document).querySelector(selector);
    }

    function qa(selector, ctx) {
        return Array.prototype.slice.call((ctx || document).querySelectorAll(selector));
    }

    function range(count) {
        var result = [];
        for (var i = 0; i < count; i++) result.push(i);
        return result;
    }

    function esc(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function escAttr(value) {
        return esc(value).replace(/`/g, "&#96;");
    }
})();
