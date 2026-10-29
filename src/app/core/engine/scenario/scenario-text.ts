import { SCENE_MESSAGES } from '../../content/scenario-records';
export const text = (s: string): string[] => s.split("\n");
export const message = (id: string, n = 0): string[] => text(SCENE_MESSAGES[id][n]);
export const normal = (s: string): string => s
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
