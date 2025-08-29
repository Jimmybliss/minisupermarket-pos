// Centralized base URL for backend API. Allows runtime override via window.__env.BASE_URL
// Default to deployed backend; can still be overridden at runtime via window.__env.BASE_URL
const __env = (window as any).__env || {};
export const BASE_url: string = __env.BASE_URL || 'https://mini-supermarket-2.onrender.com/';
