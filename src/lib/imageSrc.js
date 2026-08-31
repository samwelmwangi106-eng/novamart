export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';

export function safeImageSrc(src) {
  if (!src || typeof src !== 'string') return FALLBACK_IMAGE;
  const cleaned = src.trim().replace(/^["']+|["']+$/g, '');
  if (cleaned.startsWith('https://') || cleaned.startsWith('http://') || cleaned.startsWith('/')) {
    return cleaned;
  }
  return FALLBACK_IMAGE;
}
