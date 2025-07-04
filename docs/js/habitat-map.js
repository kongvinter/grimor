class HabitatFragmentationMap {
    constructor({ width, height, seed, palette }) {
        this.width = width;
        this.height = height;
        this.seed = seed;
        this.palette = palette;
        this.simplex = new SimplexNoise(String(seed));
        this.fragmentationNoise = new SimplexNoise(String(seed + 1000));
        this.corridorNoise = new SimplexNoise(String(seed + 2000));
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    noise(x, y) {
        return this.simplex.noise2D(x, y) * 0.5 + 0.5;
    }

    fragmentationNoise2D(x, y) {
        return this.fragmentationNoise.noise2D(x, y) * 0.5 + 0.5;
    }

    corridorNoise2D(x, y) {
        return this.corridorNoise.noise2D(x, y) * 0.5 + 0.5;
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
                
                // Efeito de borda do mapa
                const edgeX = Math.min(x / this.width, (this.width - x) / this.width);
                const edgeY = Math.min(y / this.height, (this.height - y) / this.height);
                const edgeFactor = Math.min(edgeX, edgeY) * 2;
                height *= edgeFactor;
                
                map[x][y] = Math.min(1, Math.max(0, height));
            }
        }
        
        return map;
    }

    generateFragmentationMap(fragmentationLevel, habitatType) {
        const fragmentMap = new Array(this.width).fill(null).map(() => new Array(this.height));
        const threshold = 1 - (fragmentationLevel / 100);
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                let fragValue = 0;
                
                // Diferentes padrões de fragmentação por tipo de habitat
                switch(habitatType) {
                    case 'forest':
                        fragValue = this.fragmentationNoise2D(x * 0.02, y * 0.02);
                        break;
                    case 'grassland':
                        fragValue = this.fragmentationNoise2D(x * 0.015, y * 0.015);
                        break;
                    case 'wetland':
                        fragValue = this.fragmentationNoise2D(x * 0.025, y * 0.025);
                        break;
                    case 'mixed':
                        fragValue = (this.fragmentationNoise2D(x * 0.02, y * 0.02) + 
                                   this.fragmentationNoise2D(x * 0.015, y * 0.015)) / 2;
                        break;
                }
                
                fragmentMap[x][y] = fragValue > threshold;
            }
        }
        
        return fragmentMap;
    }

    generateCorridorMap(corridorDensity) {
        const corridorMap = new Array(this.width).fill(null).map(() => new Array(this.height));
        const threshold = 1 - (corridorDensity / 100);
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                // Corredores tendem a seguir padrões lineares
                const horizontalCorridor = Math.abs(this.corridorNoise2D(x * 0.001, y * 0.05)) > 0.7;
                const verticalCorridor = Math.abs(this.corridorNoise2D(x * 0.05, y * 0.001)) > 0.7;
                const diagonalCorridor = Math.abs(this.corridorNoise2D(x * 0.02, y * 0.02)) > threshold;
                
                corridorMap[x][y] = horizontalCorridor || verticalCorridor || diagonalCorridor;
            }
        }
        
        return corridorMap;
    }

    calculateEdgeEffects(heightMap, fragmentMap, edgeDistance) {
        const edgeMap = new Array(this.width).fill(null).map(() => new Array(this.height));
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                edgeMap[x][y] = false;
                
                // Verifica se está próximo a uma área fragmentada ou borda de habitat
                for (let dx = -edgeDistance; dx <= edgeDistance; dx++) {
                    for (let dy = -edgeDistance; dy <= edgeDistance; dy++) {
                        const nx = x + dx;
                        const ny = y + dy;
                        
                        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                            const distance = Math.sqrt(dx * dx + dy * dy);
                            if (distance <= edgeDistance) {
                                // Efeito de borda próximo a fragmentação
                                if (fragmentMap[nx][ny]) {
                                    edgeMap[x][y] = true;
                                    break;
                                }
                                
                                // Efeito de borda entre diferentes tipos de habitat
                                const heightDiff = Math.abs(heightMap[x][y] - heightMap[nx][ny]);
                                if (heightDiff > 0.3) {
                                    edgeMap[x][y] = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (edgeMap[x][y]) break;
                }
            }
        }
        
        return edgeMap;
    }

    generateCorridorBuffer(corridorMap, bufferDistance) {
        const bufferMap = new Array(this.width).fill(null).map(() => new Array(this.height));
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                bufferMap[x][y] = false;
                
                if (!corridorMap[x][y]) {
                    for (let dx = -bufferDistance; dx <= bufferDistance; dx++) {
                        for (let dy = -bufferDistance; dy <= bufferDistance; dy++) {
                            const nx = x + dx;
                            const ny = y + dy;
                            
                            if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
                                const distance = Math.sqrt(dx * dx + dy * dy);
                                if (distance <= bufferDistance && corridorMap[nx][ny]) {
                                    bufferMap[x][y] = true;
                                    break;
                                }
                            }
                        }
                        if (bufferMap[x][y]) break;
                    }
                }
            }
        }
        
        return bufferMap;
    }

    render(heightMap, fragmentMap, corridorMap, edgeMap, corridorBufferMap) {
        const img = this.ctx.createImageData(this.width, this.height);
        const data = img.data;
        
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                const height = heightMap[x][y];
                const isFragmented = fragmentMap[x][y];
                const isCorridor = corridorMap[x][y];
                const isEdge = edgeMap[x][y];
                const isCorridorBuffer = corridorBufferMap[x][y];
                
                const color = this.palette.apply(height, isFragmented, isCorridorBuffer, isCorridor, isEdge);
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
        this.fragmentationNoise = new SimplexNoise(String(this.seed + 1000));
        this.corridorNoise = new SimplexNoise(String(this.seed + 2000));
        
        const heightMap = this.generateHeightMap(opts.octaves, opts.persistence, opts.lacunarity);
        const fragmentMap = this.generateFragmentationMap(opts.fragmentationLevel, opts.habitatType);
        const corridorMap = this.generateCorridorMap(opts.corridorDensity);
        const edgeMap = this.calculateEdgeEffects(heightMap, fragmentMap, opts.edgeEffect);
        const corridorBufferMap = this.generateCorridorBuffer(corridorMap, 5);
        
        this.render(heightMap, fragmentMap, corridorMap, edgeMap, corridorBufferMap);
    }
}
