import { SettingsSection } from "spcr-settings";

function main() {
  const defaultSkipPercent = 3;
  const { Player } = Spicetify;
  let scrollTimeout: number;
  let wasPlaying: boolean | null;
  let progressBar: HTMLDivElement;
  let progressBarElapsed: Element;
  let progressBarRemaining: Element;

  const settings = new SettingsSection("Seek on scroll", "seekOnScroll");
  settings.addInput(
    "skipPercent",
    "Set percentage of track time to skip on each scroll (1-100 int)",
    defaultSkipPercent.toString(),
    undefined,
    "number",
  );
  settings.addToggle("invertScroll", "Invert scroll direction", false);
  settings.pushSettings();

  function setProgress(newProgressMs: number) {
    Player.seek(newProgressMs);
    if (wasPlaying) Player.play();
    wasPlaying = null;
  }

  function handleScroll(event: WheelEvent) {
    if (scrollTimeout) clearTimeout(scrollTimeout);

    const isPlaying = Player.isPlaying();
    if (isPlaying) Player.pause();
    if (wasPlaying == null) wasPlaying = isPlaying;

    const { style } = progressBar;
    let { deltaY } = event;
    if (settings.getFieldValue("invertScroll")) deltaY = -deltaY;

    let currentSkipPercent = parseInt(settings.getFieldValue("skipPercent"), 10);
    if (currentSkipPercent < 1 || currentSkipPercent > 100 || Number.isNaN(currentSkipPercent)) {
      currentSkipPercent = defaultSkipPercent;
    }
    const currentProgressPercent = parseFloat(style.getPropertyValue("--progress-bar-transform"));

    let newProgressPercent;
    switch (true) {
      case deltaY > 0:
        newProgressPercent = currentProgressPercent - currentSkipPercent;
        if (newProgressPercent < 0) newProgressPercent = 0;
        break;
      case deltaY < 0:
        newProgressPercent = currentProgressPercent + currentSkipPercent;
        if (newProgressPercent > 100) newProgressPercent = 100;
        break;
      default:
        return;
    }

    const durationMs = Player.getDuration();
    const newProgressMs = Math.floor((newProgressPercent / 100) * durationMs);

    const isRemainingDisplayed = progressBarRemaining.innerHTML.startsWith("-");
    if (isRemainingDisplayed) {
      const remainingMs = durationMs - newProgressMs;
      progressBarRemaining.innerHTML = `-${Player.formatTime(remainingMs)}`;
    }

    progressBarElapsed.innerHTML = Player.formatTime(newProgressMs);
    style.setProperty("--progress-bar-transform", `${newProgressPercent}%`);

    scrollTimeout = setTimeout(setProgress, 400, newProgressMs);
  }

  function onProgressBarLoad() {
    progressBarElapsed = document.querySelector(
      ".playback-bar__progress-time-elapsed",
    ) as HTMLDivElement;
    progressBarRemaining = document.querySelector(
      ".main-playbackBarRemainingTime-container",
    ) as HTMLDivElement;
    progressBar.addEventListener("wheel", (event) => handleScroll(event));
  }

  function waitForProgressBar() {
    progressBar = document.querySelector(
      ".playback-bar .playback-progressbar-isInteractive .progress-bar",
    ) as HTMLDivElement;
    if (progressBar) {
      onProgressBarLoad();
    } else {
      setTimeout(waitForProgressBar, 100);
    }
  }

  waitForProgressBar();
  document.addEventListener("fullscreenchange", () => {
    setTimeout(waitForProgressBar, 300);
  });
}

export default main;
