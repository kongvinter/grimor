const palettes = {
    default: {
        apply(height, isFragmented, isCorridorBuffer, isCorridor, isEdge) {
            if (isFragmented) return '#ef4444'; // Área fragmentada - vermelho
            if (isCorridor) return '#84cc16'; // Corredor ecológico - verde lima
            if (isCorridorBuffer) return '#fbbf24'; // Zona de transição - amarelo
            if (isEdge) return '#f97316'; // Efeito de borda - laranja
            
            if (height < 0.3) return '#1e40af'; // Água profunda
            if (height < 0.45) return '#3b82f6'; // Água rasa
            if (height < 0.6) return '#22c55e'; // Habitat principal
            if (height < 0.75) return '#16a34a'; // Habitat secundário
            if (height < 0.9) return '#78716c'; // Montanha
            return '#f4f4f5'; // Pico nevado
        }
    },
    
    bw: {
        apply(height, isFragmented, isCorridorBuffer, isCorridor, isEdge) {
            if (isFragmented) return '#000000';
            if (isCorridor) return '#888888';
            if (isCorridorBuffer) return '#666666';
            if (isEdge) return '#333333';
            
            const gray = Math.floor(height * 255);
            const hex = gray.toString(16).padStart(2, '0');
            return `#${hex}${hex}${hex}`;
        }
    },
    
    ecological: {
        apply(height, isFragmented, isCorridorBuffer, isCorridor, isEdge) {
            if (isFragmented) return '#dc2626'; // Vermelho intenso para áreas fragmentadas
            if (isCorridor) return '#65a30d'; // Verde escuro para corredores
            if (isCorridorBuffer) return '#f59e0b'; // Amarelo para buffer
            if (isEdge) return '#ea580c'; // Laranja para bordas
            
            if (height < 0.3) return '#1e3a8a'; // Azul escuro - água profunda
            if (height < 0.45) return '#2563eb'; // Azul - água rasa
            if (height < 0.6) return '#059669'; // Verde escuro - floresta densa
            if (height < 0.75) return '#10b981'; // Verde - floresta
            if (height < 0.9) return '#6b7280'; // Cinza - montanha
            return '#f3f4f6'; // Branco - neve
        }
    }
};
