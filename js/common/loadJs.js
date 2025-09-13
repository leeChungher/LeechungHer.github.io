const loadedJs = new Set();

export function loadJs(url) {
  if (loadedJs.has(url)) return;
  loadedJs.add(url);

  const script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}
