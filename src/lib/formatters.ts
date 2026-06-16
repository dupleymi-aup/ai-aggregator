/**
 * Utility functions for formatting and validation
 */

/**
 * Format token count with suffix (K, M, B)
 */
export function formatTokens(count: number): string {
  if (count >= 1_000_000_000) {
    return `${(count / 1_000_000_000).toFixed(1)}B`;
  }
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Format duration in seconds to human-readable string
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) {
    return remainingSeconds > 0 
      ? `${minutes}m ${Math.round(remainingSeconds)}s`
      : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}h ${remainingMinutes}m`
    : `${hours}h`;
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Debounce function execution
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate a simple ID (shorter than uuid)
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    
    // Fallback for older browsers or non-HTTPS
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if browser supports a feature
 */
export function supportsFeature(feature: string): boolean {
  const features: Record<string, () => boolean> = {
    'web-workers': () => typeof Worker !== 'undefined',
    'service-worker': () => 'serviceWorker' in navigator,
    'local-storage': () => {
      try {
        localStorage.setItem('__test__', 'test');
        localStorage.removeItem('__test__');
        return true;
      } catch {
        return false;
      }
    },
    'indexed-db': () => typeof indexedDB !== 'undefined',
    'webassembly': () => typeof WebAssembly !== 'undefined',
  };
  
  return features[feature]?.() ?? false;
}
