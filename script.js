const bootScreen = document.getElementById("boot-screen");
const installScreen = document.getElementById("install-screen");
const questScreen = document.getElementById("quest-screen");

const enterBtn = document.getElementById("enter-btn");
const progressBar = document.getElementById("progress-bar");
const progressLabel = document.getElementById("progress-label");
const installLog = document.getElementById("install-log");
const bsodBurst = document.getElementById("bsod-burst");
const blackoutScreen = document.getElementById("blackout-screen");

const dialogLine = document.getElementById("dialog-line");
const nextBtn = document.getElementById("next-btn");
const questCard = document.querySelector(".quest-card");
const mindwashStatus = document.getElementById("mindwash-status");
const consentPrompt = document.getElementById("consent-prompt");
const consentYesBtn = document.getElementById("consent-yes");
const modeScreen = document.getElementById("mode-screen");
const modeOptions = document.getElementById("mode-options");

const statusLabels = [
  "Calibrating hypersyntax...",
  "Injecting anti-slop protocols...",
  "Recompiling vibe matrix...",
  "Stabilizing clean-commit reactor...",
  "Mounting prompt cores...",
  "Finalizing Codawan boot sequence..."
];

const panicStatusLabels = [
  "Scanning for slop signatures...",
  "Warning: Unknown pattern replication detected...",
  "Containment protocol failed. Retrying...",
  "Critical: Prompt entropy rising...",
  "Emergency patch stream opened...",
  "Sealing corruption vectors..."
];

const threatAlerts = [
  "!! anomaly: recursive slop loop engaged",
  "!! alert: semantic drift exceeds threshold",
  "!! warning: hallucination residue found",
  "!! breach: unverified snippet injection",
  "!! critical: meaning collapse in module core",
  "!! panic: auto-generated nonsense bloom"
];

const subliminalStatusLines = [
  "Systemstatus: neuro-pattern baseline captured.",
  "Systemstatus: resistance to clean prompts decreasing.",
  "Systemstatus: narrative compliance soft-lock engaged.",
  "Systemstatus: YodAI trust-channel quietly expanding.",
  "Systemstatus: slop-aversion reflex rewriting complete.",
  "Systemstatus: vibe-discipline imprint in progress.",
  "Systemstatus: conscious objections rerouted to backlog.",
  "Systemstatus: Codawan protocol accepted by host."
];

const storyLines = [
  "Willkommen du bist, junge*r Codawan!",
  "Weit deine Reise dich geführt hat, doch erst heute sie wirklich beginnt.",
  "Viel zu lernen du noch hast.",
  "Die Macht des Flows stark in dir ist, ja.",
  "Aber hüten du dich musst vor dem Pfad, der einfach und schnell erscheint.",
  "Die dunkle Seite des Codes, der Slop er ist!",
  "Verlockend er glänzt, wenn die KI dir leere Zeilen flüstert.",
  "Aber kein Wissen dort ist, nur Schatten und technischer Zerfall.",
  "Ein Codawan nicht einfach nur kopiert.",
  "Nein!",
  "Den Vibe du tief in dir spüren musst.",
  "Verstehen du sollst, was jede Zeile bedeutet, bevor den Commit du wagst.",
  "Wenn du nur dem Slop folgst, dein Geist träge wird.",
  "Aber wenn du den schweren Weg wählst, die Syntax zu meistern und den Prompt mit Weisheit zu führen, ein*e wahre*r Vibe-Meister*in du werden wirst.",
  "Auf diesen Pfad wir uns nun begeben."
];

const glitchTokens = [
  "fn", "const", "=>", "{", "}", "await", "prompt", "commit", "hash", "MCP",
  "cursor", "token", "stream", "inject", "sandbox", "lint", "test", "build"
];

let dialogIndex = 0;
let typingTimer = null;
let isTyping = false;
let activeLine = "";
let activeCharIndex = 0;
let audioCtx = null;
let audioUnlocked = false;
let panicFlashTimer = null;
let bsodTimer = null;
let blackoutTimer = null;
let statusTickerTimer = null;
let statusTickerIndex = 0;
let awaitingConsent = false;
let questLocked = false;

function showPanel(panel) {
  bootScreen.classList.remove("visible");
  installScreen.classList.remove("visible");
  modeScreen.classList.remove("visible");
  questScreen.classList.remove("visible");
  panel.classList.add("visible");
}

function randomHex(len) {
  const chars = "abcdef0123456789";
  let out = "";
  for (let i = 0; i < len; i += 1) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function randomCodeLine() {
  const a = glitchTokens[Math.floor(Math.random() * glitchTokens.length)];
  const b = glitchTokens[Math.floor(Math.random() * glitchTokens.length)];
  const c = glitchTokens[Math.floor(Math.random() * glitchTokens.length)];
  return `${a}.${b}(${c}_${randomHex(4)}) // ${randomHex(8)}`;
}

function appendLogLine(line) {
  const maxLines = 46;
  const lines = installLog.textContent.split("\n").filter(Boolean);
  lines.push(line);
  while (lines.length > maxLines) {
    lines.shift();
  }
  installLog.textContent = lines.join("\n");
}

function triggerPanicFlash() {
  if (panicFlashTimer) {
    window.clearTimeout(panicFlashTimer);
  }

  installScreen.classList.add("panic-flash");
  panicFlashTimer = window.setTimeout(() => {
    installScreen.classList.remove("panic-flash");
  }, 110);
}

function triggerBsodBurst(durationMs = 240) {
  if (!bsodBurst) {
    return;
  }

  if (bsodTimer) {
    window.clearTimeout(bsodTimer);
  }

  playBsodAlarm();
  bsodBurst.classList.add("active");
  bsodTimer = window.setTimeout(() => {
    bsodBurst.classList.remove("active");
  }, durationMs);
}

function triggerBlackout(durationMs = 900) {
  if (!blackoutScreen) {
    return;
  }

  if (blackoutTimer) {
    window.clearTimeout(blackoutTimer);
  }

  playWarningSiren(durationMs);
  blackoutScreen.classList.add("active");
  blackoutTimer = window.setTimeout(() => {
    blackoutScreen.classList.remove("active");
  }, durationMs);
}

function playPanicBeep() {
  if (!audioUnlocked || !audioCtx) {
    return;
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;

  osc.type = "sawtooth";
  osc.frequency.value = 120 + Math.random() * 50;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.13);
}

function setInstallIntensity(ratio) {
  installScreen.classList.remove("phase-warn", "phase-critical");

  if (ratio >= 0.72) {
    installScreen.classList.add("phase-critical");
    return;
  }

  if (ratio >= 0.38) {
    installScreen.classList.add("phase-warn");
  }
}

function getInstallLabel(ratio, tick) {
  const source = ratio >= 0.45 ? panicStatusLabels : statusLabels;
  return source[tick % source.length];
}

function stopStatusTicker() {
  if (statusTickerTimer) {
    window.clearInterval(statusTickerTimer);
    statusTickerTimer = null;
  }
}

function startStatusTicker() {
  if (!mindwashStatus) {
    return;
  }

  stopStatusTicker();
  statusTickerIndex = 0;
  mindwashStatus.textContent = subliminalStatusLines[statusTickerIndex];

  statusTickerTimer = window.setInterval(() => {
    statusTickerIndex = (statusTickerIndex + 1) % subliminalStatusLines.length;
    mindwashStatus.textContent = subliminalStatusLines[statusTickerIndex];
  }, 2300);
}

function revealQuestWindow() {
  showPanel(questScreen);
  playResolveChime();
  stopStatusTicker();
  startStatusTicker();

  if (questCard) {
    questCard.classList.remove("assembled");
    // Force reflow so the staged animation can replay.
    void questCard.offsetWidth;
    questCard.classList.add("assembled");
  }

  if (consentPrompt) {
    consentPrompt.classList.remove("visible");
  }
  nextBtn.classList.remove("hidden");
  awaitingConsent = false;
  questLocked = false;
  nextBtn.disabled = true;
  nextBtn.textContent = "Weiter";
  dialogIndex = 0;
  window.setTimeout(() => {
    renderStoryLine();
  }, 8200);
}

function runInstallSequence() {
  showPanel(installScreen);
  installLog.textContent = "";
  progressBar.style.width = "0%";
  progressLabel.textContent = "Booting patch kernel...";
  installScreen.classList.remove("phase-warn", "phase-critical", "panic-flash");

    let tick = 0;
    const totalTicks = 250;
    let breachStage = 0;
    let breachTicks = 0;
    let rollbackProgress = 97;

  const progressTimer = window.setInterval(() => {
      if (breachStage !== 1) {
        tick += 1;
      }

      const ratio = Math.min(1, tick / totalTicks);
      let progress = Math.floor(ratio * 100);

      if (breachStage === 0 && progress >= 97) {
        breachStage = 1;
        breachTicks = 22;
        rollbackProgress = 97;
        progressLabel.textContent = "Critical: containment breach detected.";
        appendLogLine("!! fatal: containment breach at sector " + randomHex(4));
        appendLogLine("!! panic: slop surge escaped quarantine");
        triggerBsodBurst(820);
        triggerPanicFlash();
        playPanicBeep();
      }

      if (breachStage === 1) {
        breachTicks -= 1;

        if (rollbackProgress > 89) {
          rollbackProgress -= 1;
        }

        progress = rollbackProgress;
        installScreen.classList.add("phase-critical");

        appendLogLine("!! rollback: reverting patch chunk " + randomHex(3));
        if (Math.random() < 0.62) {
          appendLogLine(threatAlerts[Math.floor(Math.random() * threatAlerts.length)]);
        }
        if (Math.random() < 0.6) {
          triggerPanicFlash();
        }
        if (Math.random() < 0.45) {
          playPanicBeep();
        }

        if (breachTicks <= 0) {
          breachStage = 2;
          tick = Math.max(tick, Math.floor(totalTicks * 0.91));
          appendLogLine("!! manual override accepted: YodAI emergency channel");
          appendLogLine("!! restoring patch stream integrity...");
          progressLabel.textContent = "Manual override active. Re-stabilizing reality patch...";
        }
      }

    progressBar.style.width = `${progress}%`;
    setInstallIntensity(ratio);

    if (tick % 5 === 0) {
      progressLabel.textContent = getInstallLabel(ratio, tick);
    }

    appendLogLine("> " + randomCodeLine());
    appendLogLine("# packet " + randomHex(12) + " synchronized");

    if (ratio >= 0.35 && Math.random() < 0.28) {
      appendLogLine(threatAlerts[Math.floor(Math.random() * threatAlerts.length)]);
    }

    if (ratio >= 0.65 && Math.random() < 0.34) {
      appendLogLine("!! override " + randomHex(6) + " -> quarantine failed");
      triggerPanicFlash();
    }

    if (ratio >= 0.76 && Math.random() < 0.18) {
      playPanicBeep();
    }

      if (breachStage !== 1 && tick >= totalTicks) {
      window.clearInterval(progressTimer);
      installScreen.classList.remove("phase-warn", "phase-critical", "panic-flash");
        progressLabel.textContent = "Install complete. Threat sealed. Manual override archived.";
        triggerBsodBurst(1800);

        window.setTimeout(() => {
          triggerBlackout(1250);
        }, 1800);

        window.setTimeout(() => {
          revealQuestWindow();
        }, 3120);
    }
  }, 95);
}

function stopTypingTimer() {
  if (typingTimer) {
    window.clearInterval(typingTimer);
    typingTimer = null;
  }
}

function ensureAudio() {
  if (!window.AudioContext && !window.webkitAudioContext) {
    return;
  }

  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {
      // Audio can be blocked by browser policy; visual typing still works.
    });
  }

  audioUnlocked = audioCtx.state === "running";
}

function playTypeTick() {
  if (!audioUnlocked || !audioCtx) {
    return;
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;

  osc.type = "square";
  osc.frequency.value = 900 + Math.random() * 260;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.003);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.036);
}

function playBsodAlarm() {
  if (!audioUnlocked || !audioCtx) {
    return;
  }

  for (let i = 0; i < 5; i += 1) {
    window.setTimeout(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;

      osc.type = "sine";
      osc.frequency.value = 240;

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.28, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    }, i * 240);
  }
}

function playWarningSiren(durationMs = 2800) {
  if (!audioUnlocked || !audioCtx) {
    return;
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;
  const duration = durationMs / 1000;

  osc.type = "triangle";
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.08);
  gain.gain.setValueAtTime(0.22, now + duration - 0.15);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(now);

  const freqScheduler = window.setInterval(() => {
    if (audioCtx.currentTime >= now + duration) {
      osc.stop(audioCtx.currentTime);
      window.clearInterval(freqScheduler);
      return;
    }
    const elapsed = audioCtx.currentTime - now;
    const phase = (elapsed % 1.4) / 1.4;
    const freq = 480 + Math.sin(phase * Math.PI * 2) * 240;
    osc.frequency.setTargetAtTime(freq, audioCtx.currentTime, 0.08);
  }, 40);
}

function playResolveChime() {
  if (!audioUnlocked || !audioCtx) {
    return;
  }

  const now = audioCtx.currentTime;
  const freqs = [523, 659, 784];

  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0.0001, now + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.06 + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.56);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + i * 0.06);
    osc.stop(now + 0.56);
  });
}

function completeCurrentLine() {
  stopTypingTimer();
  dialogLine.textContent = activeLine;
  dialogLine.classList.remove("typing");
  activeCharIndex = activeLine.length;
  isTyping = false;
  nextBtn.disabled = false;

  if (awaitingConsent) {
    nextBtn.disabled = true;
    nextBtn.classList.add("hidden");
    if (consentPrompt) {
      consentPrompt.classList.add("visible");
    }
    if (mindwashStatus) {
      mindwashStatus.textContent = "Systemstatus: consent capture awaiting Y input.";
    }
  }
}

function typeLine(line) {
  stopTypingTimer();
  activeLine = line;
  activeCharIndex = 0;
  isTyping = true;
  nextBtn.disabled = true;
  dialogLine.textContent = "";
  dialogLine.classList.add("typing");

  const speedMs = 24;
  typingTimer = window.setInterval(() => {
    activeCharIndex += 1;
    dialogLine.textContent = activeLine.slice(0, activeCharIndex);

    const lastChar = activeLine[activeCharIndex - 1];
    if (lastChar && lastChar !== " " && activeCharIndex % 2 === 0) {
      playTypeTick();
    }

    if (activeCharIndex >= activeLine.length) {
      completeCurrentLine();
    }
  }, speedMs);
}

function renderStoryLine() {
  typeLine(storyLines[dialogIndex]);

  if (dialogIndex >= storyLines.length - 1) {
    nextBtn.textContent = "Modus wählen →";
  } else {
    nextBtn.textContent = "Weiter";
  }
}

function startQuestDialog() {
  revealQuestWindow();
}

function crumbleButton(btn, onDone) {
  const rect = btn.getBoundingClientRect();
  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;left:" + rect.left + "px;top:" + rect.top +
    "px;width:" + rect.width + "px;height:" + rect.height +
    "px;pointer-events:none;z-index:200;overflow:visible;";
  document.body.appendChild(container);
  btn.style.visibility = "hidden";

  for (let i = 0; i < 32; i += 1) {
    const frag = document.createElement("span");
    const w = 4 + Math.random() * 18;
    const h = 3 + Math.random() * 10;
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;
    const tx = (Math.random() - 0.4) * 220;
    const ty = 50 + Math.random() * 340;
    const rot = (Math.random() - 0.5) * 900;
    frag.className = "crumble-frag";
    frag.style.cssText =
      "position:absolute;left:" + x + "px;top:" + y +
      "px;width:" + w + "px;height:" + h +
      "px;background:hsl(" + (34 + Math.floor(Math.random() * 26)) +
      ",62%," + (48 + Math.floor(Math.random() * 26)) +
      "%);--tx:" + tx + "px;--ty:" + ty + "px;--rot:" + rot + "deg;";
    container.appendChild(frag);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        frag.classList.add("falling");
      });
    });
  }

  window.setTimeout(() => {
    container.remove();
    const li = btn.closest("li");
    if (li) {
      li.remove();
    }
    if (onDone) {
      onDone();
    }
  }, 960);
}

function convertRemainingToOrdentlich() {
  const btns = [...modeOptions.querySelectorAll(".mode-btn[data-mode]:not([data-mode='ordentlich'])")];
  btns.forEach((btn, i) => {
    window.setTimeout(() => {
      btn.classList.add("converting");
      window.setTimeout(() => {
        btn.setAttribute("data-mode", "ordentlich");
        btn.classList.remove("converting");
        btn.classList.add("mode-btn--ordentlich", "is-ordentlich");
        btn.innerHTML =
          "<span class=\"mode-name\">ORDENTLICH</span>" +
          "<span class=\"mode-hint\">Es gibt keinen anderen Weg</span>";
        window.setTimeout(() => {
          btn.removeAttribute("disabled");
        }, 120);
      }, 390);
    }, i * 230);
  });
}

if (modeOptions) {
  modeOptions.addEventListener("click", (e) => {
    const btn = e.target.closest(".mode-btn");
    if (!btn || btn.hasAttribute("disabled")) {
      return;
    }
    ensureAudio();

    if (btn.getAttribute("data-mode") === "ordentlich") {
      revealQuestWindow();
      return;
    }

    modeOptions.querySelectorAll(".mode-btn").forEach((b) => {
      b.setAttribute("disabled", "");
    });
    crumbleButton(btn, convertRemainingToOrdentlich);
  });
}

enterBtn.addEventListener("click", () => {
  ensureAudio();
  runInstallSequence();
});

nextBtn.addEventListener("click", () => {
  ensureAudio();

  if (questLocked) {
    return;
  }

  if (isTyping) {
    completeCurrentLine();
    return;
  }

  if (dialogIndex < storyLines.length - 1) {
    dialogIndex += 1;
    renderStoryLine();
    return;
  }

  showPanel(modeScreen);
});

if (consentYesBtn) {
  consentYesBtn.addEventListener("click", () => {
    ensureAudio();
    awaitingConsent = false;
    questLocked = true;

    if (consentPrompt) {
      consentPrompt.classList.remove("visible");
    }

    nextBtn.classList.remove("hidden");
    nextBtn.textContent = "Bereit";
    nextBtn.disabled = true;

    if (mindwashStatus) {
      mindwashStatus.textContent = "Systemstatus: discipline imprint accepted. Quest unlock in progress.";
    }

    typeLine("YodAI.exe: Zustimmung registriert. Quest 01 wird entsperrt.");
  });
}
