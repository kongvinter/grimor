export const defaultPalette = {
  /**
   * Retorna uma cor hex com base na altura.
   * @param {number} height - Valor entre 0.0 (baixo) e 1.0 (alto).
   * @returns {string} Cor hexadecimal (#RRGGBB).
   */
  apply(height) {
    if (height < 0.3) {
      // Água
      return '#3b82f6'; // azul profundo
    } else if (height < 0.45) {
      // Litoral / pântano
      return '#60a5fa'; // azul claro
    } else if (height < 0.6) {
      // Planícies
      return '#22c55e'; // verde médio
    } else if (height < 0.75) {
      // Colinas
      return '#15803d'; // verde escuro
    } else if (height < 0.9) {
      // Montanhas
      return '#78716c'; // cinza rochoso
    } else {
      // Picos nevados
      return '#f4f4f5'; // branco gelo
    }
  }
};
