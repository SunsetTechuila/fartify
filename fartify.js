addEventListener('click', () => {
  const fart = document.createElement('audio');
  fart.src = 'https://www.myinstants.com/media/sounds/fart-with-reverb.mp3';
  document.body.appendChild(fart);
  fart.play();
  fart.addEventListener('ended', () => {
    fart.parentNode.removeChild(fart);
  });
});
