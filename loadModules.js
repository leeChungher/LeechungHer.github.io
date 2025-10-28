export class ModuleLoader {
  constructor(selector) {
    this.container = document.querySelector(selector);
  }

  async load(path) {
    const response = await fetch(path);
    const moduleData = await response.json();
    this.injectHtml(moduleData.html);
    this.injectCss(moduleData.css);
    this.injectJs(moduleData.js);
  }

  async loadToMain(path) {
    const response = await fetch(path);
    const moduleData = await response.json();
    this.container.innerHTML = '';
    this.injectHtml(moduleData.html);
    this.injectCss(moduleData.css);
    this.injectJs(moduleData.js);
  }

  injectHtml(html) {
    this.container.insertAdjacentHTML('beforeend', html);
  }

  injectCss(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  injectJs(js) {
    const script = document.createElement('script');
    script.textContent = js;
    document.body.appendChild(script);
  }
}