export function formatarCpf(valor: string): string {
    const digitos = valor.replace(/\D/g, "").slice(0, 11);
    return digitos
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function formatarCep(valor: string): string {
    const digitos = valor.replace(/\D/g, "").slice(0, 8);
    return digitos.replace(/(\d{5})(\d)/, "$1-$2");
}
