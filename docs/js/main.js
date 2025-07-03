import SimplexNoise from 'https://cdn.jsdelivr.net/npm/simplex-noise@4.0.1/dist/esm/simplex-noise.js';

const defaultPalette = {
  apply(height) {
    if (height < 0.3) {
      return '#3b82f6';
    } else if (height < 0.45) {
      return '#60a5fa';
    } else if (height < 0.6) {
      return '#22c55e';
    } else if (height < 0.75) {
      return '#15803d';
    } else if (height < 0.9) {
      return '#78716c';
    } else {
      return '#f4f4f5';
    }
  }
};

class MapGenerator {
  constructor({ width, height, seed, palette }) {
    this.width = width;
    this.height = height;
    this.seed = seed;
    this.palette = palette;
    this.simplex = new SimplexNoise(String(seed));
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  noise(x, y) {
    return this.simplex.noise2D(x, y) * 0.5 + 0.5;
  }

  generateHeightMap(octaves = 4, persistence = 0.5, lacunarity = 2) {
    const map = new Array(this.width).fill(null).map(() => new Array(this.height));
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        let amplitude = 1, frequency = 1, height = 0;
        for (let o = 0; o < octaves; o++) {
          height += this.noise(x * frequency * 0.01, y * frequency * 0.01) * amplitude;
          amplitude *= persistence;
          frequency *= lacunarity;
        }
        const edgeX = Math.min(x / this.width, (this.width - x) / this.width);
        const edgeY = Math.min(y / this.height, (this.height - y) / this.height);
        const edgeFactor = Math.min(edgeX, edgeY) * 2;
        height *= edgeFactor;
        map[x][y] = Math.min(1, Math.max(0, height));
      }
    }
    return map;
  }

  render(map) {
    const img = this.ctx.createImageData(this.width, this.height);
    const data = img.data;
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const height = map[x][y];
        const color = this.palette.apply(height);
        const i = (y * this.width + x) * 4;
        data[i] = parseInt(color.slice(1, 3), 16);
        data[i + 1] = parseInt(color.slice(3, 5), 16);
        data[i + 2] = parseInt(color.slice(5, 7), 16);
        data[i + 3] = 255;
      }
    }
    this.ctx.putImageData(img, 0, 0);
  }

  generate(opts) {
    Object.assign(this, opts);
    this.simplex = new SimplexNoise(String(this.seed));
    const heightMap = this.generateHeightMap(opts.octaves, opts.persistence, opts.lacunarity);
    this.render(heightMap);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const btnGenerate = document.getElementById('generateBtn');
  const inpWidth = document.getElementById('width');
  const inpHeight = document.getElementById('height');
  const inpSeed = document.getElementById('seed');

  function generateMap() {
  let width = parseInt(inpWidth.value, 10);
  let height = parseInt(inpHeight.value, 10);
  let seed = parseInt(inpSeed.value, 10);


  if (isNaN(width) || width < 100 || width > 2000) width = 800;
  if (isNaN(height) || height < 100 || height > 2000) height = 600;
  if (isNaN(seed)) {
  seed = Date.now();
  inpSeed.value = seed;
}
  inpWidth.value = width;
  inpHeight.value = height;
  inpSeed.value = seed;

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
