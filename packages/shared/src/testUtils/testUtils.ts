import '@testing-library/jest-dom/extend-expect';

import { render, RenderOptions } from '@testing-library/react';
import React from 'react';

import { noop } from '../utils';

// Wrap components with test providers
const customRender = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, options);
};

// Re-export everything
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render method
export { customRender as render, noop };
