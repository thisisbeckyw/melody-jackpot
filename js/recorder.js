/* ============================================================
   YOUR MELODY JACKPOT — take recorder
   Records the mic during the sing phase, converts each take to
   WAV in the browser, and keeps a set list of takes.
   Nothing is uploaded; audio never leaves the player's device.
   Requires a secure context (https or localhost) — on file://
   pages the recording APIs don't exist and the game falls back
   to a friendly note.
   ============================================================ */

const Recorder = (() => {
  "use strict";

  const takes = [];        // { name, file, url, ext, label }
  let stream = null;
  let mediaRecorder = null;
  let chunks = [];
  let active = false;      // toggle state
  let recording = false;
  let takeCount = 0;       // total takes ever started (for numbering)

  function supported() {
    return !!(
      window.isSecureContext !== false &&
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.MediaRecorder
    );
  }

  async function enable() {
    if (!supported()) throw new Error("unsupported");
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    active = true;
  }

  function disable() {
    active = false;
    if (recording) stopNow();
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
  }

  function isOn() { return active; }

  function start(meta) {
    if (!active || recording || !stream) return false;
    chunks = [];
    try {
      mediaRecorder = new MediaRecorder(stream);
    } catch (_) {
      return false;
    }
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size) chunks.push(e.data);
    };
    mediaRecorder.start();
    mediaRecorder._meta = meta || {};
    recording = true;
    return true;
  }

  function stopNow() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try { mediaRecorder.stop(); } catch (_) {}
    }
    recording = false;
  }

  /* Stop and save the take. Resolves with the take, or null. */
  function stop() {
    return new Promise((resolve) => {
      if (!recording || !mediaRecorder) { resolve(null); return; }
      const mr = mediaRecorder;
      const meta = mr._meta;
      mr.onstop = async () => {
        recording = false;
        const raw = new Blob(chunks, { type: mr.mimeType || "audio/webm" });
        chunks = [];
        if (!raw.size) { resolve(null); return; }
        takeCount++;
        const take = await buildTake(raw, meta, takeCount);
        takes.push(take);
        resolve(take);
      };
      try { mr.stop(); } catch (_) { resolve(null); }
    });
  }

  async function buildTake(rawBlob, meta, n) {
    let file = rawBlob;
    let ext = extFor(rawBlob.type);
    try {
      file = await toWav(rawBlob);
      ext = "wav";
    } catch (_) {
      /* decode failed — keep the original container, still playable */
    }
    const slug = [meta.mood, meta.genre].filter(Boolean).join("-")
      .toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const name = `melody-jackpot-take-${n}${slug ? "-" + slug : ""}.${ext}`;
    return {
      name,
      file,
      ext,
      url: URL.createObjectURL(file),
      label: `TAKE ${n}` + (meta.mood ? ` — ${meta.mood} · ${meta.genre}` : "")
    };
  }

  function extFor(mime) {
    if (!mime) return "webm";
    if (mime.includes("mp4")) return "m4a";
    if (mime.includes("ogg")) return "ogg";
    return "webm";
  }

  /* ---------- WAV conversion (16-bit PCM) ---------- */
  async function toWav(blob) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) throw new Error("no AudioContext");
    const ctx = new AC();
    try {
      const buf = await ctx.decodeAudioData(await blob.arrayBuffer());
      return encodeWav(buf);
    } finally {
      if (ctx.close) ctx.close().catch(() => {});
    }
  }

  function encodeWav(audioBuffer) {
    const numCh = Math.min(2, audioBuffer.numberOfChannels);
    const rate = audioBuffer.sampleRate;
    const frames = audioBuffer.length;
    const bytesPerSample = 2;
    const blockAlign = numCh * bytesPerSample;
    const dataSize = frames * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
    writeStr(0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeStr(8, "WAVE");
    writeStr(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);              // PCM
    view.setUint16(22, numCh, true);
    view.setUint32(24, rate, true);
    view.setUint32(28, rate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true);
    writeStr(36, "data");
    view.setUint32(40, dataSize, true);

    const channels = [];
    for (let c = 0; c < numCh; c++) channels.push(audioBuffer.getChannelData(c));
    let off = 44;
    for (let i = 0; i < frames; i++) {
      for (let c = 0; c < numCh; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
        off += 2;
      }
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  function removeTake(i) {
    const t = takes[i];
    if (!t) return;
    URL.revokeObjectURL(t.url);
    takes.splice(i, 1);
  }

  return {
    takes, supported, enable, disable, isOn,
    start, stop, removeTake, _encodeWav: encodeWav
  };
})();
