import 'regenerator-runtime/runtime';

import Clerk from './core/clerk';
import { mountComponentRenderer } from './ui';

Clerk.mountComponentRenderer = mountComponentRenderer;

const frontendApi =
  document.querySelector('script[data-clerk-frontend-api]')?.getAttribute('data-clerk-frontend-api') ||
  window.__clerk_frontend_api ||
  '';

window.Clerk = new Clerk(frontendApi);

if (module.hot) {
  module.hot.accept();
}
