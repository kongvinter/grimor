// main.js
import { MapGenerator } from './mapGenerator.js';
import { defaultPalette } from '../themes/defaultPalette.js';

document.addEventListener('DOMContentLoaded', () => {
  // Captura dos elementos
  const canvas = document.getElementById('canvas');
  const btnGenerate = document.getElementById('generateBtn');
  const inpWidth = document.getElementById('width');
  const inpHeight = document.getElementById('height');
  const inpSeed = document.getElementById('seed');

  // Função para instanciar e gerar o mapa
  function generateMap() {
    const width = parseInt(inpWidth.value, 10) || 800;
    const height = parseInt(inpHeight.value, 10) || 600;
    const seed = parseInt(inpSeed.value, 10) || Date.now();

    // Configura o canvas
    canvas.width = width;
    canvas.height = height;

    // Instancia o gerador com opções
    const generator = new MapGenerator({
      width,
      height,
      seed,
      palette: defaultPalette
    });

    // Gera usando parâmetros padrão de ruído
    generator.generate({
      width,
      height,
      seed,
      octaves: 4,
      persistence: 0.5,
      lacunarity: 2
    });
  }

  // Eventos
  btnGenerate.addEventListener('click', generateMap);

  // Geração inicial ao carregar a página
  generateMap();
});
