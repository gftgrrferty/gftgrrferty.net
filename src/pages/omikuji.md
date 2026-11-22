---
layout: "default"
lang: "ja"
permalink: "/omikuji/"
title: "おみくじ"
---

# おみくじ

<button id="draw" type="button">おみくじを引く</button>
<p id="result"></p>

<script>
  const button = document.getElementById("draw");
  const result = document.getElementById("result");
  button.addEventListener("click", async () => {
    const res = await fetch("https://omikuji.gftgrrferty.workers.dev");
    const data = await res.json();
    result.textContent = data.unsei + "：" + data.message;
  });
</script>
