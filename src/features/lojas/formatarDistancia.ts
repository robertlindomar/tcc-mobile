export function formatarDistancia(distanciaKm: number): string {
    const casasDecimais = distanciaKm < 10 ? 1 : 0;
    return `${distanciaKm.toLocaleString("pt-BR", {
        maximumFractionDigits: casasDecimais,
        minimumFractionDigits: casasDecimais,
    })} km de você`;
}
