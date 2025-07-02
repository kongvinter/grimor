// mapGenerator.js
import SimplexNoise from 'simplex-noise';

/**
 * @typedef {Object} Options
 * @property {number} width
 * @property {number} height
 * @property {number} seed
 * @property {import('../themes/defaultPalette.js').defaultPalette} palette
 */

export class MapGenerator {
  /**
   * @param {Options} opts
   */
  constructor({ width, height, seed, palette }) {
    this.width = width;
    this.height = height;
    this.seed = seed;
    this.palette = palette;
    this.simplex = new SimplexNoise(String(seed));

    // Criar canvas e contexto
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * Gera ruído simplex normalizado entre 0 e 1
   */
  noise(x, y) {
    return this.simplex.noise2D(x, y) * 0.5 + 0.5;
  }

  /**
   * Gera o mapa de altura com múltiplas octaves
   */
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
        // Fator de borda (fade nas bordas)
        const edgeX = Math.min(x / this.width, (this.width - x) / this.width);
        const edgeY = Math.min(y / this.height, (this.height - y) / this.height);
        const edgeFactor = Math.min(edgeX, edgeY) * 2;
        height *= edgeFactor;

        map[x][y] = Math.min(1, Math.max(0, height));
      }
    }
    return map;
  }

  /**
   * Renderiza o mapa de altura com base na paleta
   */
  render(map) {
    const img = this.ctx.createImageData(this.width, this.height);
    const data = img.data;

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const height = map[x][y];
        const color = this.palette.apply(height);

        const i = (y * this.width + x) * 4;
        data[i] = parseInt(color.slice(1, 3), 16);     // R
        data[i + 1] = parseInt(color.slice(3, 5), 16); // G
        data[i + 2] = parseInt(color.slice(5, 7), 16); // B
        data[i + 3] = 255;                             // A
      }
    }

    this.ctx.putImageData(img, 0, 0);
  }

  /**
   * Geração principal com parâmetros atualizáveis
   */
  generate(opts) {
    Object.assign(this, opts);
    this.simplex = new SimplexNoise(String(this.seed));
    const heightMap = this.generateHeightMap(opts.octaves, opts.persistence, opts.lacunarity);
    this.render(heightMap);
  }
}
