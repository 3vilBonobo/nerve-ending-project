export type CommandName = 'HELP' | 'DIR' | 'CD' | 'OPEN' | 'SEARCH' | 'STATUS' | 'INFO' | 'LOG' | 'CLEAR' | 'RECOVER' | 'DIAG';
export interface ParsedCommand { name: CommandName; args: string[]; error?: string }
const ALIASES: Record<string, CommandName> = { HELP: 'HELP', DIR: 'DIR', LIST:'DIR', LS: 'DIR', CD: 'CD', OPEN: 'OPEN', READ: 'OPEN', SEARCH: 'SEARCH', STATUS: 'STATUS', INFO: 'INFO', LOG: 'LOG', CLEAR: 'CLEAR', CLS: 'CLEAR', RECOVER: 'RECOVER', DIAG: 'DIAG' };
export function parseCommand(input: string): ParsedCommand | undefined {
  const word = input.trim().split(/\s+/)[0]?.toUpperCase();
  if (!word || !ALIASES[word]) return undefined;
  const rest = input.trim().slice(word.length).trim();
  if(word==='LIST'&&/^(?:engineers|employees|staff|people|departments|products)\b/i.test(rest))return undefined;
  const tokens: string[] = [];
  const regex = /"([^"]*)"|'([^']*)'|([^\s]+)/g;
  const unquoted = rest.replace(/"[^"]*"|'[^']*'/g, '');
  if (unquoted.includes('"') || /(?:^|\s)'/.test(unquoted)) {
    return { name: ALIASES[word], args: [], error: 'Unclosed quote. Example: OPEN "COMPANY_PROFILE.TXT"' };
  }
  for (const match of rest.matchAll(regex)) tokens.push(match[1] ?? match[2] ?? match[3]);
  return { name: ALIASES[word], args: tokens };
}
export function resolvePath(input: string, cwd: string): string {
  const normalized = input.replace(/\\/g, '/').toUpperCase();
  const parts = (normalized.startsWith('/') ? normalized : `${cwd}/${normalized}`).split('/');
  const result: string[] = [];
  for (const part of parts) {
    if (part === '..') result.pop();
    else if (part && part !== '.') result.push(part);
  }
  return `/${result.join('/')}`;
}
