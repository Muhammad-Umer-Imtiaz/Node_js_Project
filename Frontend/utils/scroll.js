const isBrowser = () => typeof window !== 'undefined';

export function scrollToTop() {
  if (!isBrowser()) return;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function scrollToBottom() {
  if (!isBrowser()) return;
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}