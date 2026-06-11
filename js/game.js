/* ============================================================
   YOUR MELODY JACKPOT — game logic
   States: idle → spinning → result(3s) → sing(30s) → win/lose
   ============================================================ */

(() => {
  "use strict";

  const CELL = 46;          // px, must match .reel-cell height
  const WINDOW_H = 118;     // px, must match .reel-window height
  const CENTER = (WINDOW_H - CELL) / 2;
  const RESULT_SECONDS = 3;
  const SING_SECONDS = 30;
  const READ_BEAT_MS = 1000;  // lyrics land first; the clock starts a beat later

  const reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- helpers ---------- */
  const $ = (sel) => document.querySelector(sel);
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- shuffle bags: random that FEELS random ----------
     Draw without replacement; reshuffle when empty, and never
     let a fresh bag start with the item just served. */
  function makeBag(items) {
    let bag = shuffle(items);
    let last = null;
    return () => {
      if (bag.length === 0) {
        bag = shuffle(items);
        if (bag.length > 1 && bag[bag.length - 1] === last) {
          // move the would-be repeat off the top of the deck
          const i = Math.floor(Math.random() * (bag.length - 1));
          [bag[bag.length - 1], bag[i]] = [bag[i], bag[bag.length - 1]];
        }
      }
      last = bag.pop();
      return last;
    };
  }

  const drawMood = makeBag(MOODS);
  const drawGenre = makeBag(GENRES);
  const drawCouplet = makeBag(COUPLETS);

  /* ---------- DOM refs ---------- */
  const scaler = $("#scaler");
  const machine = $("#machine");
  const lever = $("#lever");
  const leverArm = $("#lever-arm");
  const placard = $("#placard");
  const stripM = $("#strip-mood");
  const stripG = $("#strip-genre");
  const aboutVeil = $("#about");

  /* ---------- state ---------- */
  let state = "idle";
  let spin = { mood: null, genre: null };
  let resultTimer = null;
  let singTimer = null;
  let beatTimer = null;
  let tickLoop = null;
  let takeRolling = false;

  function clearTimers() {
    clearInterval(resultTimer); resultTimer = null;
    clearInterval(singTimer); singTimer = null;
    clearTimeout(beatTimer); beatTimer = null;
    clearInterval(tickLoop); tickLoop = null;
  }

  /* ---------- fit the whole show inside the window ---------- */
  function fitStage() {
    scaler.style.transform = "none";
    const w = scaler.offsetWidth;
    const h = scaler.offsetHeight;
    if (!w || !h) return; // headless / not laid out yet
    let scale = Math.min(
      1,
      (window.innerWidth - 8) / w,
      (window.innerHeight - 8) / h
    );
    scaler.style.transform = `scale(${scale})`;

    /* Closed loop: offsetHeight predictions can miss (font swaps,
       margins, absolutely positioned pieces), so measure what was
       actually painted and correct until it truly fits. */
    if (!scaler.getBoundingClientRect) return;
    for (let i = 0; i < 3; i++) {
      const r = scaler.getBoundingClientRect();
      if (!r.height || !r.width) break;
      const correction = Math.min(
        1,
        (window.innerHeight - 8 - Math.max(r.top, 0)) / r.height,
        (window.innerWidth - 8) / r.width
      );
      if (correction >= 0.999) break;
      scale *= correction;
      scaler.style.transform = `scale(${scale})`;
    }
  }
  function lockAndFit() { lockPlacardHeight(); fitStage(); }
  window.addEventListener("resize", fitStage);
  window.addEventListener("load", lockAndFit);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(lockAndFit).catch(() => {});
  }

  /* ---------- reels ---------- */
  function fillIdleReels() {
    setStaticCell(stripM, "PULL");
    setStaticCell(stripG, "THE LEVER");
  }

  function setStaticCell(strip, word) {
    strip.style.transition = "none";
    strip.innerHTML = "";
    strip.appendChild(decoCell());
    strip.appendChild(wordCell(word));
    strip.appendChild(decoCell());
    strip.style.transform = `translateY(${CENTER - CELL}px)`;
  }

  function wordCell(text) {
    const d = document.createElement("div");
    d.className = "reel-cell";
    d.textContent = text;
    return d;
  }
  function decoCell() {
    const d = document.createElement("div");
    d.className = "reel-cell deco";
    d.textContent = "\u2726 \u2726 \u2726";
    return d;
  }

  function spinReel(strip, bank, target, duration, onStop) {
    const current = strip.querySelector(".reel-cell:not(.deco)");
    const startWord = current ? current.textContent : rand(bank);

    const cells = [startWord];
    const pool = shuffle(bank.filter((w) => w !== target));
    const RUN = 24;
    for (let i = 0; i < RUN; i++) {
      cells.push(i % 5 === 4 ? null : pool[i % pool.length]); // null = deco
    }
    cells.push(target);
    cells.push(pool[0] || startWord); // peek row below the payline

    strip.innerHTML = "";
    cells.forEach((w) =>
      strip.appendChild(w === null ? decoCell() : wordCell(w))
    );

    const targetIndex = cells.length - 2;
    const startY = CENTER;                       // start word centered
    const endY = CENTER - targetIndex * CELL;    // target centered

    strip.style.transition = "none";
    strip.style.transform = `translateY(${startY}px)`;
    // force reflow so the transition below actually animates
    void strip.offsetHeight;

    if (!reduceMotion) strip.classList.add("blur");
    strip.style.transition =
      `transform ${duration}ms cubic-bezier(0.12, 0.7, 0.18, 1)`;
    strip.style.transform = `translateY(${endY}px)`;

    let fired = false;
    const done = () => {
      if (fired) return;
      fired = true;
      strip.classList.remove("blur");
      strip.removeEventListener("transitionend", done);
      onStop();
    };
    strip.addEventListener("transitionend", done);
    // safety net in case transitionend is swallowed (tab switch etc.)
    setTimeout(done, duration + 400);
  }

  /* ---------- spin ---------- */
  function pullLever() {
    if (state !== "idle" && state !== "result" && state !== "win" && state !== "lose") return;
    clearTimers();
    Sound.unlock();
    Sound.pull();

    state = "spinning";
    spin.mood = drawMood();
    spin.genre = drawGenre();

    renderSpinningPlacard();

    const durM = reduceMotion ? 450 : 1700;
    const durG = reduceMotion ? 550 : 2300;

    if (!reduceMotion) {
      tickLoop = setInterval(() => Sound.tick(), 65);
      setTimeout(() => { clearInterval(tickLoop); tickLoop = null; }, durG);
    }

    let stopped = 0;
    const onStop = () => {
      stopped++;
      Sound.clack();
      if (stopped >= 2 && state === "spinning") enterResult();
    };
    spinReel(stripM, MOODS, spin.mood, durM, onStop);
    spinReel(stripG, GENRES, spin.genre, durG, onStop);
  }

  /* ---------- placard HTML builders ----------
     Pure string builders, used both to render live states and to
     pre-measure the tallest possible placard at boot. */
  function setPlacard(html) {
    placard.innerHTML = `<div class="placard-content">${html}</div>`;
  }

  const DIAL_R = 52;
  const DIAL_CIRC = (2 * Math.PI * DIAL_R).toFixed(1);

  function htmlIdle() {
    return `
      <h2>On stage tonight&hellip;</h2>
      <p class="sub">YOU, FRIEND. TWO SHOWS NIGHTLY.</p>
      <div class="rule"></div>
      <p class="hint">One pull wins you a mood and a style.
      Sing the couplet that way before the clock runs out.</p>
      <div class="btn-row">
        <button class="btn btn-coral" id="btn-pull">PULL THE LEVER</button>
      </div>
      <p class="smallprint">NO COVER &middot; NO MINIMUM &middot; NO REFUNDS</p>
    `;
  }

  function htmlSpinning() {
    return `
      <h2>The wheels are turning&hellip;</h2>
      <p class="sub">WHERE THEY STOP, NOBODY KNOWS</p>
      <div class="rule"></div>
    `;
  }

  function htmlResult(mood, genre) {
    return `
      <h2>The house deals you&hellip;</h2>
      <div class="combo">
        ${mood}
        <span class="amp">in the style of</span>
        ${genre}
      </div>
      <div class="count-row" id="count-row">
        <span class="count-bulb">3</span>
        <span class="count-bulb">2</span>
        <span class="count-bulb">1</span>
      </div>
      <div class="btn-row">
        <button class="btn btn-quiet" id="btn-respin">SPIN AGAIN</button>
        <button class="btn btn-coral" id="btn-lock">LOCK IT IN</button>
      </div>
      <p class="smallprint">LOCKS IN WHEN THE LIGHTS GO OUT</p>
    `;
  }

  function htmlSing(mood, genre, c, rolling) {
    return `
      <h2>Now appearing&hellip;</h2>
      <p class="sub">${mood} &middot; ${genre}</p>
      <div class="lyric-label">&#9834; SING THESE LYRICS &#9834;</div>
      <div class="lyric-card">
        ${c.l[0]}<br>${c.l[1]}
      </div>
      <div class="btn-row">
        <button class="btn btn-coral" id="btn-sang">I SANG IT</button>
      </div>
      <div class="timer-dial waiting" id="dial">
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle class="track" cx="60" cy="60" r="${DIAL_R}"></circle>
          <circle class="arc" id="arc" cx="60" cy="60" r="${DIAL_R}"
            stroke-dasharray="${DIAL_CIRC}" stroke-dashoffset="0"></circle>
        </svg>
        <div class="timer-num" id="timer-num">${SING_SECONDS}</div>
      </div>
      <p class="smallprint">${rolling ? '<span class="rec-dot">&#9679;</span> TAPE IS ROLLING &middot; ' : ""}CROONER'S HONOR</p>
    `;
  }

  function savedPrefix(label) {
    return `<span class="rec-dot">&#9679;</span> ${label} SAVED TO THE SET LIST &middot; `;
  }

  function htmlWin(genre, savedLabel) {
    return `
      <div class="jackpot-banner">JACKPOT</div>
      <p class="sub">A GENUINE ${genre} NUMBER</p>
      <div class="rule"></div>
      <p class="hint">The house tips its hat. The pit boss wants your autograph.</p>
      <div class="btn-row">
        <button class="btn btn-coral" id="btn-again">PULL AGAIN</button>
      </div>
      <p class="smallprint">${savedLabel ? savedPrefix(savedLabel) : ""}HOT STREAKS DON'T WAIT</p>
    `;
  }

  function htmlLose(savedLabel) {
    return `
      <div class="nodice">NO DICE</div>
      <p class="sub">THE CLOCK PLAYS FOR THE HOUSE</p>
      <div class="rule"></div>
      <p class="hint">Happens to the best crooners. Even the King missed a cue.</p>
      <div class="btn-row">
        <button class="btn btn-coral" id="btn-again">DOUBLE OR NOTHING</button>
      </div>
      <p class="smallprint">${savedLabel ? savedPrefix(savedLabel) : ""}THE WHEELS FEEL GENEROUS TONIGHT. PROBABLY.</p>
    `;
  }

  /* ---------- lock the placard at its tallest possible height ----------
     The cabinet used to grow and shrink between phases because the sing
     screen (and long couplets that wrap) exceeded the placard's minimum.
     At boot we render every state into an invisible ghost — using the
     longest mood, the longest genre, and the dozen longest couplets —
     measure them with the real fonts, and pin the placard to the max.
     The machine then keeps one size for the whole game, and fitStage
     scales that worst case to the window. */
  function lockPlacardHeight() {
    placard.style.height = "auto";
    const width = placard.clientWidth;
    if (!width) return; // not laid out (headless) — CSS min-height fallback

    const ghost = document.createElement("div");
    ghost.className = "placard";
    ghost.style.position = "absolute";
    ghost.style.visibility = "hidden";
    ghost.style.height = "auto";
    ghost.style.minHeight = "0";
    ghost.style.width = width + "px";
    placard.parentNode.appendChild(ghost);

    const longest = (arr) => arr.reduce((a, b) => (b.length > a.length ? b : a));
    const longMood = longest(MOODS);
    const longGenre = longest(GENRES);
    const byMaxLine = COUPLETS.slice().sort((a, b) =>
      Math.max(b.l[0].length, b.l[1].length) - Math.max(a.l[0].length, a.l[1].length)).slice(0, 6);
    const byTotal = COUPLETS.slice().sort((a, b) =>
      (b.l[0].length + b.l[1].length) - (a.l[0].length + a.l[1].length)).slice(0, 6);
    const worst = [...new Set([...byMaxLine, ...byTotal])];
    const savedLabel = "TAKE 99 \u2014 " + longMood + " \u00B7 " + longGenre;

    const candidates = [
      htmlIdle(), htmlSpinning(), htmlResult(longMood, longGenre),
      htmlWin(longGenre, savedLabel), htmlLose(savedLabel),
      ...worst.map((c) => htmlSing(longMood, longGenre, c, true))
    ];
    let max = 0;
    for (const h of candidates) {
      ghost.innerHTML = `<div class="placard-content">${h}</div>`;
      max = Math.max(max, ghost.offsetHeight);
    }
    ghost.remove();
    if (max > 0) placard.style.height = max + "px";
  }

  /* ---------- live renderers ---------- */
  function renderIdlePlacard() {
    setPlacard(htmlIdle());
    $("#btn-pull").addEventListener("click", pullLever);
  }

  function renderSpinningPlacard() {
    setPlacard(htmlSpinning());
  }

  function enterResult() {
    state = "result";
    setPlacard(htmlResult(spin.mood, spin.genre));
    $("#btn-respin").addEventListener("click", () => { Sound.click(); pullLever(); });
    $("#btn-lock").addEventListener("click", enterSing);
    $("#btn-lock").focus({ preventScroll: true });

    const bulbs = placard.querySelectorAll(".count-bulb");
    let remaining = RESULT_SECONDS;
    Sound.tap();
    resultTimer = setInterval(() => {
      remaining--;
      if (remaining <= 0) {
        clearInterval(resultTimer); resultTimer = null;
        enterSing();
        return;
      }
      Sound.tap();
      bulbs[RESULT_SECONDS - remaining - 1].classList.add("out");
    }, 1000);
  }

  /* ---------- sing phase ---------- */
  function enterSing() {
    if (state !== "result") return;
    clearTimers();
    state = "sing";
    Sound.ding();

    takeRolling = Recorder.isOn() &&
      Recorder.start({ mood: spin.mood, genre: spin.genre });

    const c = drawCouplet();
    setPlacard(htmlSing(spin.mood, spin.genre, c, takeRolling));
    $("#btn-sang").addEventListener("click", () => endRound(true));
    $("#btn-sang").focus({ preventScroll: true });

    const arc = $("#arc");
    const num = $("#timer-num");
    const dial = $("#dial");
    let remaining = SING_SECONDS;

    // a beat to read the lyrics before the clock starts
    beatTimer = setTimeout(() => {
      beatTimer = null;
      if (state !== "sing") return;
      dial.classList.remove("waiting");
      Sound.tap();
      singTimer = setInterval(() => {
        remaining--;
        if (remaining < 0) {
          clearInterval(singTimer); singTimer = null;
          endRound(false);
          return;
        }
        num.textContent = remaining;
        arc.style.strokeDashoffset =
          (DIAL_CIRC * (1 - remaining / SING_SECONDS)).toFixed(1);
        if (remaining <= 5 && remaining > 0) {
          dial.classList.add("hot");
          Sound.tapHot();
        }
      }, 1000);
    }, READ_BEAT_MS);
  }

  /* ---------- win / lose ---------- */
  function endRound(won) {
    if (state !== "sing") return;
    clearTimers();
    state = won ? "win" : "lose";

    if (takeRolling) {
      takeRolling = false;
      Recorder.stop().then((take) => {
        updateRecUi();
        if (!take) return;
        const sp = placard.querySelector(".smallprint");
        if (sp) sp.innerHTML = savedPrefix(take.label) + sp.innerHTML;
      });
    }

    if (won) {
      Sound.jackpot();
      machine.classList.add("flash");
      scaler.classList.add("win-flash");
      setTimeout(() => {
        machine.classList.remove("flash");
        scaler.classList.remove("win-flash");
      }, 1600);
      coinShower();
      setPlacard(htmlWin(spin.genre, null));
    } else {
      Sound.nodice();
      machine.classList.add("shake");
      setTimeout(() => machine.classList.remove("shake"), 500);
      setPlacard(htmlLose(null));
    }
    const again = $("#btn-again");
    again.addEventListener("click", () => { Sound.click(); pullLever(); });
    again.focus({ preventScroll: true });
  }

  function coinShower() {
    if (reduceMotion) return;
    const N = 34;
    const glyphs = ["\u266A", "\u266B", "$", "\u2726"];
    for (let i = 0; i < N; i++) {
      const coin = document.createElement("div");
      coin.className = "coin c" + (1 + (i % 3));
      coin.textContent = rand(glyphs);
      coin.style.left = Math.random() * 100 + "vw";
      coin.style.setProperty("--s", (0.6 + Math.random() * 0.8).toFixed(2));
      coin.style.setProperty("--r", Math.floor(240 + Math.random() * 720) + "deg");
      coin.style.animationDuration = (0.9 + Math.random() * 1.1).toFixed(2) + "s";
      coin.style.animationDelay = (Math.random() * 0.5).toFixed(2) + "s";
      document.body.appendChild(coin);
      coin.addEventListener("animationend", () => coin.remove());
    }
  }

  /* ---------- about modal ---------- */
  function openAbout() {
    Sound.click();
    aboutVeil.hidden = false;
    $("#btn-close-about").focus({ preventScroll: true });
  }
  function closeAbout() {
    aboutVeil.hidden = true;
  }
  $("#btn-about").addEventListener("click", openAbout);
  $("#btn-close-about").addEventListener("click", closeAbout);
  aboutVeil.addEventListener("click", (e) => {
    if (e.target === aboutVeil) closeAbout();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !aboutVeil.hidden) closeAbout();
  });

  /* ---------- sound toggle ---------- */
  const soundBtn = $("#btn-sound");
  soundBtn.addEventListener("click", () => {
    const nowMuted = !Sound.isMuted();
    Sound.setMuted(nowMuted);
    soundBtn.setAttribute("aria-pressed", String(!nowMuted));
    soundBtn.textContent = nowMuted ? "SOUND: OFF" : "SOUND: ON";
    if (!nowMuted) { Sound.unlock(); Sound.click(); }
  });

  /* ---------- lever: a real pull ----------
     Drag the knob down; past 60% travel it fires on release and
     springs back. A quick tap (under 8px of travel) still works,
     as do Enter and Space. */
  const PULL_TRAVEL = 120;     // px of drag = full pull
  const FIRE_AT = 0.6;
  let dragging = false;
  let startY = 0;
  let progress = 0;

  function setPull(p) {
    progress = Math.max(0, Math.min(1, p));
    lever.style.setProperty("--pull", progress.toFixed(3));
  }

  function springBack(fire) {
    leverArm.classList.add("snap");
    setPull(fire ? 1 : 0);
    // let the arm visibly hit bottom, then release
    setTimeout(() => {
      setPull(0);
      setTimeout(() => leverArm.classList.remove("snap"), 480);
    }, fire ? 110 : 0);
    if (fire) pullLever();
  }

  lever.addEventListener("pointerdown", (e) => {
    dragging = true;
    startY = e.clientY;
    leverArm.classList.remove("snap");
    if (lever.setPointerCapture && e.pointerId !== undefined) {
      try { lever.setPointerCapture(e.pointerId); } catch (_) {}
    }
    e.preventDefault();
  });

  lever.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    setPull((e.clientY - startY) / PULL_TRAVEL);
  });

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    const moved = e.clientY - startY;
    if (moved < 8) {
      // a tap still counts as a pull
      springBack(true);
    } else {
      springBack(progress >= FIRE_AT);
    }
  }
  lever.addEventListener("pointerup", endDrag);
  lever.addEventListener("pointercancel", () => { dragging = false; springBack(false); });

  lever.addEventListener("keydown", (e) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      springBack(true);
    }
  });
  // suppress the synthetic click that follows pointerup (pull already handled)
  lever.addEventListener("click", (e) => e.preventDefault());

  /* ---------- take recorder UI ---------- */
  const recBtn = $("#btn-rec");
  const setlistBtn = $("#btn-setlist");
  const recNote = $("#rec-note");
  const setlistVeil = $("#setlist");
  const setlistBody = $("#setlist-body");

  function updateRecUi() {
    setlistBtn.textContent = `SET LIST (${Recorder.takes.length})`;
    recBtn.textContent = Recorder.isOn() ? "REC: ON" : "REC: OFF";
    recBtn.setAttribute("aria-pressed", String(Recorder.isOn()));
  }

  const DECLINED_NOTE = "No tape tonight \u2014 the house won't record. " +
    "If you want to keep what you catch, roll your own on a phone or recorder.";

  if (Recorder.supported()) {
    recBtn.hidden = false;
    setlistBtn.hidden = false;

    const welcomeVeil = $("#welcome");
    function closeWelcome() { welcomeVeil.hidden = true; }

    // every visit starts with REC off, so the modal is the session's
    // on-ramp — it shows on every load and dismisses in one click
    welcomeVeil.hidden = false;

    $("#btn-roll-tape").addEventListener("click", async () => {
      Sound.click();
      closeWelcome();
      try {
        await Recorder.enable();
        updateRecUi();
      } catch (_) {
        recBtn.textContent = "REC: MIC BLOCKED";
        recNote.textContent = DECLINED_NOTE;
        recNote.hidden = false;
        setTimeout(updateRecUi, 1800);
      }
    });
    $("#btn-no-tape").addEventListener("click", () => {
      Sound.click();
      closeWelcome();
      recNote.textContent = DECLINED_NOTE;
      recNote.hidden = false;
    });
    welcomeVeil.addEventListener("click", (e) => {
      if (e.target === welcomeVeil) closeWelcome();
    });

    recBtn.addEventListener("click", async () => {
      Sound.click();
      if (Recorder.isOn()) {
        Recorder.disable();
        updateRecUi();
        return;
      }
      recBtn.textContent = "REC: ASKING\u2026";
      try {
        await Recorder.enable();
      } catch (_) {
        recBtn.textContent = "REC: MIC BLOCKED";
        setTimeout(updateRecUi, 1800);
        return;
      }
      recNote.hidden = true;
      updateRecUi();
    });

    function renderSetlist() {
      if (!Recorder.takes.length) {
        setlistBody.innerHTML =
          `<p class="setlist-empty">Nothing on the bill yet. Flip REC on,
           pull the lever, and sing one in.</p>`;
        return;
      }
      setlistBody.innerHTML = Recorder.takes.map((t, i) => `
        <div class="take-row">
          <div class="take-label">${t.label}</div>
          <audio controls preload="metadata" src="${t.url}"></audio>
          <div class="take-actions">
            <a class="btn btn-quiet take-dl" href="${t.url}" download="${t.name}">DOWNLOAD</a>
            <button class="btn btn-quiet take-rm" data-i="${i}" aria-label="Remove ${t.label}">&#10005;</button>
          </div>
        </div>`).join("");
      setlistBody.querySelectorAll(".take-rm").forEach((b) =>
        b.addEventListener("click", () => {
          Recorder.removeTake(parseInt(b.dataset.i, 10));
          renderSetlist();
          updateRecUi();
        })
      );
    }

    setlistBtn.addEventListener("click", () => {
      Sound.click();
      renderSetlist();
      setlistVeil.hidden = false;
      $("#btn-close-setlist").focus({ preventScroll: true });
    });
    $("#btn-close-setlist").addEventListener("click", () => { setlistVeil.hidden = true; });
    setlistVeil.addEventListener("click", (e) => {
      if (e.target === setlistVeil) setlistVeil.hidden = true;
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !setlistVeil.hidden) setlistVeil.hidden = true;
    });
    updateRecUi();
  } else {
    recNote.hidden = false;
  }

  /* ---------- boot ---------- */
  fillIdleReels();
  renderIdlePlacard();
  lockAndFit();
  setTimeout(lockAndFit, 400); // settle pass after fonts/paint
})();
