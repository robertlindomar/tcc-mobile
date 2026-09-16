export function formatarDataCivil(iso: string): string {
    const [ano, mes, dia] = iso.split("-");
    if (!ano || !mes || !dia) {
        return iso;
    }
    return `${dia}/${mes}/${ano}`;
}
