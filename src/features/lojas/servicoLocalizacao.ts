import * as Location from "expo-location";

export type LocalizacaoConsumidor = {
    latitude: number;
    longitude: number;
};

export async function obterLocalizacaoConsumidor(): Promise<LocalizacaoConsumidor | null> {
    try {
        const permissao = await Location.requestForegroundPermissionsAsync();
        if (!permissao.granted) {
            return null;
        }

        const posicao = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });
        return {
            latitude: posicao.coords.latitude,
            longitude: posicao.coords.longitude,
        };
    } catch {
        return null;
    }
}
