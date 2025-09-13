export function loadHtml(url, target) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      target.innerHTML = html;
    });
}
