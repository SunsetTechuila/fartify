import { config } from "../../../package.json";

function fartify(): void {
  const fart = document.createElement("audio");
  fart.src = `${config["extensions-assets-url"]}/fart.mp3`;

  document.addEventListener("mousedown", () => {
    const currentFart = fart.cloneNode() as HTMLAudioElement;
    currentFart.play();
    currentFart.addEventListener("ended", () => {
      currentFart.remove();
    });
  });
}

export default fartify;
