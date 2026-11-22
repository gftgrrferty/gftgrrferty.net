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
  <div id="result" class="omikuji-result" hidden>
    <p class="omikuji-label">今日の運勢</p>
    <p id="unsei" class="omikuji-unsei"></p>
    <p id="message" class="omikuji-message"></p>
  </div>
</div>

<script src="/omikuji.js"></script>
