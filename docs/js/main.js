//document.addEventListener('DOMContentLoaded', () => {
//    const canvas = document.getElementById('canvas');
//    const btnGenerate = document.getElementById('generateBtn');
//    const inpWidth = document.getElementById('width');
//    const inpHeight = document.getElementById('height');
//    const inpSeed = document.getElementById('seed');
//    const selPalette = document.getElementById('palette');

//    function generateMap() {
//        let width = parseInt(inpWidth.value, 10);
//        let height = parseInt(inpHeight.value, 10);
//        let seed = parseInt(inpSeed.value, 10);
//        let paletteType = selPalette.value;

        // Validação e correção dos valores
//        if (isNaN(width) || width < 100 || width > 2000) {
//            width = 800;
//            inpWidth.value = width;
//        }
//        if (isNaN(height) || height < 100 || height > 2000) {
//            height = 600;
//            inpHeight.value = height;
//        }
 //       if (isNaN(seed)) {
//            seed = Date.now();
 //           inpSeed.value = seed;
//        }

        
//        canvas.width = width;
//        canvas.height = height;

        
//        const generator = new window.MapGenerator({
//            width,
//            height,
//            seed,
//            palette: window.palettes[paletteType] || window.palettes.default
//        });

//        generator.generate({
//            width,
//            height,
//            seed,
//            octaves: 4,
//            persistence: 0.5,
//            lacunarity: 2
//        });
//    }

//    // Event listeners
//    btnGenerate.addEventListener('click', generateMap);
//    
//    // Gerar seed aleatória se campo estiver vazio
//    const seed = Math.floor(Math.random() * 1e9);
//    }
//    
    // Gerar mapa inicial
  // main.js (corrigido)
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('canvas');
  const btnGenerate = document.getElementById('generateBtn');
  const inpWidth = document.getElementById('width');
  const inpHeight = document.getElementById('height');
  const selPalette = document.getElementById('palette');
  const inpFrag = document.getElementById('fragmentationLevel');
  const inpDensity = document.getElementById('corridorDensity');
  const inpEdge = document.getElementById('edgeEffect');
  const selHabitat = document.getElementById('habitatType');

  function generateMap() {
    // Leitura e validação
    let width = parseInt(inpWidth.value, 10);
    let height = parseInt(inpHeight.value, 10);
    if (isNaN(width) || width < 100 || width > 2000) width = 800;
    if (isNaN(height) || height < 100 || height > 2000) height = 600;
    const seed = Date.now();

    // Parâmetros
    const paletteType = selPalette.value;
    const fragmentationLevel = parseFloat(inpFrag.value);
    const corridorDensity = parseFloat(inpDensity.value);
    const edgeEffect = parseInt(inpEdge.value, 10);
    const habitatType = selHabitat.value;

    // Ajuste do canvas
    canvas.width = width;
    canvas.height = height;

    // Instancia o gerador
    const generator = new window.MapGenerator({
      width,
      height,
      seed,
      palette: window.palettes[paletteType] || window.palettes.default
    });

    // Geração com todos os parâmetros necessários
    generator.generate({
      width,
      height,
      seed,
      octaves: 4,
      persistence: 0.5,
      lacunarity: 2,
      fragmentationLevel,
      corridorDensity,
      edgeEffect,
      habitatType
    });
  }

  // Evento de clique
  btnGenerate.addEventListener('click', generateMap);

  // Geração inicial
  generateMap();
});

