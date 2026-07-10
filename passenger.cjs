process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.DOMAIN = process.env.DOMAIN || 'pollyfortrodas.com.br';

import('./dist/index.js').catch((error) => {
  console.error('Failed to start Pollyfort:', error);
  process.exit(1);
});
