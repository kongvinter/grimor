// habitat-map.js (atualizado e exposto globalmente)
class MapGenerator {
  constructor(config) {
    this.width = config.width;
    this.height = config.height;
    this.seed = config.seed;
    this.palette = config.palette;

    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.noise = new SimplexNoise(this.seed);
  }

  generate(opts) {
    this.width = opts.width;
    this.height = opts.height;
    this.seed = opts.seed;
    this.fragmentationLevel = opts.fragmentationLevel;
    this.corridorDensity = opts.corridorDensity;
    this.edgeEffect = opts.edgeEffect;
    this.habitatType = opts.habitatType;

    this.noise = new SimplexNoise(this.seed);
    this.render();
  }

  render() {
    const img = this.ctx.createImageData(this.width, this.height);
    const data = img.data;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = (y * this.width + x) * 4;
        const nx = x / this.width - 0.5;
        const ny = y / this.height - 0.5;

        const value = this.noise.noise2D(nx * 4, ny * 4);
        const isFragmented = value < this.fragmentationLevel;
        const isCorridor = value > (1 - this.corridorDensity);
        const isEdge = Math.abs(value) < (this.edgeEffect / 100);
        const isCorridorBuffer = isCorridor && isEdge;

        const color = this.palette.apply(value, isFragmented, isCorridorBuffer, isCorridor, isEdge);
        const rgb = this.hexToRgb(color);

        data[i] = rgb.r;
        data[i + 1] = rgb.g;
        data[i + 2] = rgb.b;
        data[i + 3] = 255;
      }
    }

    this.ctx.putImageData(img, 0, 0);
  }

  hexToRgb(hex) {
    const bigint = parseInt(hex.replace('#', ''), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  }
}

// Torna a classe disponível globalmente para o main.js
window.MapGenerator = MapGenerator;
