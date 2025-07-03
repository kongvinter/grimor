// Implementação simplificada do Simplex Noise
class SimplexNoise {
    constructor(seed) {
        this.seed = typeof seed === 'string' ? this.hashString(seed) : (seed || Math.random());
        this.grad3 = [
            [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
        ];
        this.p = [];
        for (let i = 0; i < 256; i++) {
            this.p[i] = Math.floor(this.seededRandom() * 256);
        }
        this.perm = [];
        for (let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }
    
    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) / 2147483647;
    }
    
    seededRandom() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }
    
    dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }
    
    noise2D(xin, yin) {
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        
        let n0, n1, n2;
        
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        
        let i1, j1;
        if (x0 > y0) {
            i1 = 1; j1 = 0;
        } else {
            i1 = 0; j1 = 1;
        }
        
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        
        const ii = i & 255;
        const jj = j & 255;
        const gi0 = this.perm[ii + this.perm[jj]] % 12;
        const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
        const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
        
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0.0;
        else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0);
        }
        
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0.0;
        else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1);
        }
        
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0.0;
        else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2);
        }
        
        return 70.0 * (n0 + n1 + n2);
    }
}

// Paletas de cores - disponível globalmente
window.palettes = {
    default: {
        apply(height) {
            if (height < 0.3) {
                return '#3b82f6'; // Água profunda
            } else if (height < 0.45) {
                return '#60a5fa'; // Água rasa
            } else if (height < 0.6) {
                return '#22c55e'; // Planície
            } else if (height < 0.75) {
                return '#15803d'; // Floresta
            } else if (height < 0.9) {
                return '#78716c'; // Montanha
            } else {
                return '#f4f4f5'; // Pico nevado
            }
        }
    },
    bw: {
        apply(height) {
            const gray = Math.floor(height * 255);
            const hex = gray.toString(16).padStart(2, '0');
            return `#${hex}${hex}${hex}`;
        }
    }
};

// Classe MapGenerator - disponível globalmente
window.MapGenerator = class MapGenerator {
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
                let amplitude = 1;
                let frequency = 1;
                let height = 0;
                
                for (let o = 0; o < octaves; o++) {
                    height += this.noise(x * frequency * 0.01, y * frequency * 0.01) * amplitude;
                    amplitude *= persistence;
                    frequency *= lacunarity;
                }
                
                // Aplicar fade nas bordas para criar formato de ilha
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
                
                data[i] = parseInt(color.slice(1, 3), 16);     // R
                data[i + 1] = parseInt(color.slice(3, 5), 16); // G
                data[i + 2] = parseInt(color.slice(5, 7), 16); // B
                data[i + 3] = 255;                             // A
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
};
