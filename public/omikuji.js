const button = document.getElementById("draw");
const resultBox = document.getElementById("result");
const unsei = document.getElementById("unsei");
const message = document.getElementById("message");
button.addEventListener("click", async () => {
  const res = await fetch("https://omikuji.gftgrrferty.workers.dev");
  const data = await res.json();
  unsei.textContent = data.unsei;
  message.textContent = data.message;
  resultBox.hidden = false;
});
