---
layout: "default"
lang: "ja"
permalink: "/omikuji/"
title: "おみくじ"
---

<h1 class="omikuji-title">おみくじ</h1>

<p class="page-lead omikuji-lead">ボタンを押すと今日の運勢が出ます。</p>

<div class="omikuji">
  <button id="draw" class="omikuji-btn" type="button">おみくじを引く</button>
  <p id="unsei" class="omikuji-unsei"></p>
  <p id="message" class="omikuji-message"></p>
</div>

<script>
  const button = document.getElementById("draw");
  const unsei = document.getElementById("unsei");
  const message = document.getElementById("message");
  button.addEventListener("click", async () => {
    const res = await fetch("https://omikuji.gftgrrferty.workers.dev");
    const data = await res.json();
    unsei.textContent = data.unsei;
    message.textContent = data.message;
  });
</script>
