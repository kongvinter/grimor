---
layout: default
title: "Gerador de Mapas Grimoire"
---

<div class="container">
  <div class="controls">
    <label for="width">Largura:</label>
    <input type="number" id="width" value="800" min="100" />

    <label for="height">Altura:</label>
    <input type="number" id="height" value="600" min="100" />

    <label for="seed">Seed:</label>
    <input type="number" id="seed" value="12345" />

    <button id="generateBtn">Gerar</button>
  </div>

  <div class="map-container">
    <canvas id="canvas"></canvas>
  </div>
</div>
