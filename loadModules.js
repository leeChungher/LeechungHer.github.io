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
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const moduleData = await response.json();
    this.container.innerHTML = '';
    this.injectHtml(moduleData.html);
    this.injectCss(moduleData.css);
    this.injectJs(moduleData.js);
  } catch (error) {
    console.error(`[ModuleLoader] 模組載入失敗：${path}`, error);
    this.container.innerHTML = `<section class="error"><h2>載入失敗</h2><p>${error.message}</p></section>`;
  }
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