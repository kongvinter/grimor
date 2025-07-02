
import { MapGenerator } from './mapGenerator.js';
import { defaultPalette } from '../themes/defaultPalette.js';

document.addEventListener('DOMContentLoaded', () => {
  
  const canvas = document.getElementById('canvas');
  const btnGenerate = document.getElementById('generateBtn');
  const inpWidth = document.getElementById('width');
  const inpHeight = document.getElementById('height');
  const inpSeed = document.getElementById('seed');

  function generateMap() {
    const width = parseInt(inpWidth.value, 10) || 800;
    const height = parseInt(inpHeight.value, 10) || 600;
    const seed = parseInt(inpSeed.value, 10) || Date.now();

    canvas.width = width;
    canvas.height = height;

    const generator = new MapGenerator({
      width,
      height,
      seed,
      palette: defaultPalette
    });

    generator.generate({
      width,
      height,
      seed,
      octaves: 4,
      persistence: 0.5,
      lacunarity: 2
    });
  }

  btnGenerate.addEventListener('click', generateMap);

  generateMap();
});
