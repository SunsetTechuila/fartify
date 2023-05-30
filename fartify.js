const fart = document.createElement("audio");
fart.src = "https://www.myinstants.com/media/sounds/fart-with-reverb.mp3";
addEventListener("mousedown", () => {
  const currentFart = fart.cloneNode();
  currentFart.play();
  currentFart.addEventListener("ended", () => {
    currentFart.remove()
  });
});
