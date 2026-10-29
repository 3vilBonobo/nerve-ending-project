import { bootstrapApplication } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { App } from './app/shell/app';

bootstrapApplication(App, {
  providers: [provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode(), registrationStrategy: 'registerWhenStable:3000' })],
}).catch(console.error);
