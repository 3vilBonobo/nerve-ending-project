import type { QaJson } from './types';
// Applied before IndexedDB writes and again at export. No browser, account or device metadata is read.
export function redactQaText(value: string): string {
    return value
        .replace(/\b(?:Bearer|Basic)\s+[A-Za-z0-9+/_=.\-]+/gi, '[REDACTED AUTH]')
        .replace(/\b(?:password|passwd|passphrase|pwd|api[_ -]?key|access[_ -]?token|refresh[_ -]?token|auth[_ -]?token|token|client[_ -]?secret|secret)\s*(?:[:=]|\bis\b|\s)\s*(?:"[^"]*"|'[^']*'|\S+)/gi, '[REDACTED CREDENTIAL]')
        .replace(/\b(?:sk-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_]{12,}|AKIA[A-Z0-9]{16})\b/g, '[REDACTED KEY]')
        .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[REDACTED TOKEN]')
        .replace(/https?:\/\/[^\s<>"']+/gi, '[REDACTED URL]')
        .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED EMAIL]')
        .replace(/(?:\+\d[\d ()-]{8,}\d|\b\d{10,15}\b|\b\d{3}[-.]\d{3}[-.]\d{4}\b|\b\d{3}-\d{2}-\d{4}\b)/g, '[REDACTED PERSONAL NUMBER]');
}
export function scrubQa(value: QaJson): QaJson {
    if (typeof value === 'string')
        return redactQaText(value);
    if (Array.isArray(value))
        return value.map(scrubQa);
    if (value && typeof value === 'object')
        return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, /^(?:password|passwd|token|accessToken|refreshToken|apiKey|secret|email|phone|address|userAgent|ipAddress|cookie|referrer)$/i.test(key) ? '[REDACTED]' : scrubQa(item)]));
    return value;
}
