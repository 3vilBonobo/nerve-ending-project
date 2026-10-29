/** jsdom lacks native dialog behavior. Keep this browser shim in tests, not application code. */
export function stubBrowserDialogs(): () => void {
    const prototype = HTMLDialogElement.prototype;
    const previousOpen = Object.getOwnPropertyDescriptor(prototype, 'showModal');
    const previousClose = Object.getOwnPropertyDescriptor(prototype, 'close');
    Object.defineProperty(prototype, 'showModal', {
        configurable: true,
        value(this: HTMLDialogElement): void { this.open = true; },
    });
    Object.defineProperty(prototype, 'close', {
        configurable: true,
        value(this: HTMLDialogElement): void { this.open = false; this.dispatchEvent(new Event('close')); },
    });
    return () => {
        if (previousOpen)
            Object.defineProperty(prototype, 'showModal', previousOpen);
        else
            Reflect.deleteProperty(prototype, 'showModal');
        if (previousClose)
            Object.defineProperty(prototype, 'close', previousClose);
        else
            Reflect.deleteProperty(prototype, 'close');
    };
}
