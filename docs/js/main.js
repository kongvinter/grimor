// Inicialização - usa variáveis globais definidas em mapGenerator.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const btnGenerate = document.getElementById('generateBtn');
    const inpWidth = document.getElementById('width');
    const inpHeight = document.getElementById('height');
    const inpSeed = document.getElementById('seed');
    const selPalette = document.getElementById('palette');

    function generateMap() {
        let width = parseInt(inpWidth.value, 10);
        let height = parseInt(inpHeight.value, 10);
        let seed = parseInt(inpSeed.value, 10);
        let paletteType = selPalette.value;

        // Validação e correção dos valores
        if (isNaN(width) || width < 100 || width > 2000) {
            width = 800;
            inpWidth.value = width;
        }
        if (isNaN(height) || height < 100 || height > 2000) {
            height = 600;
            inpHeight.value = height;
        }
        if (isNaN(seed)) {
            seed = Date.now();
            inpSeed.value = seed;
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;

        // Gerar mapa usando as classes globais
        const generator = new window.MapGenerator({
            width,
            height,
            seed,
            palette: window.palettes[paletteType] || window.palettes.default
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

    // Event listeners
    btnGenerate.addEventListener('click', generateMap);
    
    // Gerar seed aleatória se campo estiver vazio
    if (!inpSeed.value) {
        inpSeed.value = Math.floor(Math.random() * 1000000);
    }
    
    // Gerar mapa inicial
    generateMap();
});
