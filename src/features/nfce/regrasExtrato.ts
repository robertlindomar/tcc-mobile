import { NotaLidaCampanha } from "@/types/api";

/** Fração (0–1) já acumulada para o próximo ticket. */
export function progressoProximoTicket(valorResidual: number, valorPorTicket: number): number {
    if (!(valorPorTicket > 0) || !(valorResidual > 0)) {
        return 0;
    }
    return Math.min(1, valorResidual / valorPorTicket);
}

export function rotuloQuantidadeTickets(quantidade: number): string {
    return quantidade === 1 ? "1 ticket" : `${quantidade} tickets`;
}

/** Ex.: "+2 tickets (nº 7 a 8)" ou "Sem ticket" quando a nota só somou saldo. */
export function descreverTicketsNota(nota: Pick<NotaLidaCampanha, "ticketsGerados" | "numerosTickets">): string {
    if (nota.ticketsGerados <= 0) {
        return "Sem ticket (somou ao saldo)";
    }
    const faixa = nota.numerosTickets;
    if (!faixa) {
        return `+${rotuloQuantidadeTickets(nota.ticketsGerados)}`;
    }
    const numeros = faixa.primeiro === faixa.ultimo ? `nº ${faixa.primeiro}` : `nº ${faixa.primeiro} a ${faixa.ultimo}`;
    return `+${rotuloQuantidadeTickets(nota.ticketsGerados)} (${numeros})`;
}

/** 14 dígitos → 00.000.000/0000-00; outros formatos ficam como vieram. */
export function formatarCnpj(cnpj: string): string {
    const digitos = cnpj.replace(/\D/g, "");
    if (digitos.length !== 14) {
        return cnpj;
    }
    return digitos.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

/** Data/hora local no formato dd/mm/aaaa às hh:mm. */
export function formatarDataHora(iso: string): string {
    const data = new Date(iso);
    if (Number.isNaN(data.getTime())) {
        return iso;
    }
    const dois = (valor: number) => String(valor).padStart(2, "0");
    return `${dois(data.getDate())}/${dois(data.getMonth() + 1)}/${data.getFullYear()} às ${dois(data.getHours())}:${dois(data.getMinutes())}`;
}
