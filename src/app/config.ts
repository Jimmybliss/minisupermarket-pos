// Centralized base URL for backend API. Allows runtime override via window.__env.BASE_URL
export const BASE_url: string = (window as any).__env?.BASE_URL || 'http://127.0.0.1:8000';
