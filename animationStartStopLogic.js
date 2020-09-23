window.onload = () => {
  const startButton = document.querySelector(".start-animation-button");
  const stopButton = document.querySelector(".stop-animation-button");
  const illustration = document.querySelector(".illustration");

  startButton.addEventListener("click", () => {
    illustration.classList.add("animation");
    illustration.classList.remove("stop-animation");
  });

  stopButton.addEventListener("click", () => {
    illustration.classList.add("stop-animation");
    illustration.classList.remove("animation");
  });
};
