import { describe, expect, it } from 'vitest';
import { modelAssetBase } from './language-location';
describe('model location under a deployment base', () => {
    it.each(['/', '/nerve-ending-project/'])('loads local model and WASM assets beneath %s', path => {
        const origin = 'https://3vilbonobo.github.io';
        const base = modelAssetBase(`${origin}${path}language/v1/`, `${origin}${path}worker-ABC.js`);
        expect(new URL('runtime/ort-wasm-simd-threaded.wasm', base).href)
            .toBe(`${origin}${path}language/v1/runtime/ort-wasm-simd-threaded.wasm`);
    });
    it('preserves root-hosted development with a nested worker URL', () => {
        expect(modelAssetBase('http://localhost:4200/language/v1/', 'http://localhost:4200/src/app/language.worker.ts').pathname)
            .toBe('/language/v1/');
    });
    it.each([
        'https://example.com/nerve-ending-project/language/v1/',
        'https://3vilbonobo.github.io/other/language/v1/',
        'https://3vilbonobo.github.io/nerve-ending-project/language/v1/../',
        'https://3vilbonobo.github.io/nerve-ending-project/language/v1/?remote=true',
        'https://3vilbonobo.github.io/nerve-ending-project/language/v1/#other',
    ])('rejects an unrelated or malformed model root: %s', root => {
        expect(() => modelAssetBase(root, 'https://3vilbonobo.github.io/nerve-ending-project/worker-ABC.js')).toThrow();
    });
});
