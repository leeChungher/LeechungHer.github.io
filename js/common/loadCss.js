const loadedCss = new Set();

export function loadCss(url) {
  if (loadedCss.has(url)) return;
  loadedCss.add(url);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}
