/**
 * 路徑: ./modules/spec/index.js
 * 檔名: index.js
 * 功能: 載入並渲染規格書 JSON，支援 menu + 折疊
 * 修改日期: 20250922
 */
import { EventBus } from '../../eventBus.js';
import config from './config.json';

export class Spec extends EventBus {
  constructor() {
    super();
    this.moduleName = config.module;
    this.handlers = {
      loadSpec: this.loadSpec.bind(this)
    };
    this.activate();
  }

  activate() {
    config.subscriptions.forEach(({ event, handler }) => {
      if (typeof this.handlers[handler] === 'function') {
        this.subscribe(event, this.handlers[handler]);
      }
    });
  }

  async loadSpec({ file }) {
    const data = await fetch(`./modules/spec/${file}`).then(res => res.json());
    const menu = document.getElementById('specMenu');
    const content = document.getElementById('specContent');

    menu.innerHTML = '';
    content.innerHTML = '';

    data.sections.forEach((section, index) => {
      const btn = document.createElement('button');
      btn.textContent = section.title;
      btn.onclick = () => this.showSection(section, btn);
      if (index === 0) btn.classList.add('active');
      menu.appendChild(btn);
      if (index === 0) this.showSection(section, btn);
    });
  }

  showSection(section, btn) {
    document.querySelectorAll('#specMenu button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const content = document.getElementById('specContent');
    content.innerHTML = '';

    const sectionEl = document.createElement('div');
    sectionEl.className = 'spec-section';

    const header = document.createElement('div');
    header.className = 'spec-header';
    header.innerHTML = `<span>${section.title}</span><span class="spec-toggle-icon ${section.collapsed ? '' : 'rotate'}">▶</span>`;

    const body = document.createElement('div');
    body.className = 'spec-body';
    if (!section.collapsed) body.classList.add('expanded');

    if (section.content) {
      const p = document.createElement('p');
      p.textContent = section.content;
      body.appendChild(p);
    }

    if (section.bullets) {
      const ul = document.createElement('ul');
      section.bullets.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      body.appendChild(ul);
    }

    if (section.code) {
      section.code.forEach(line => {
        const pre = document.createElement('pre');
        pre.textContent = line;
        body.appendChild(pre);
      });
    }

    header.onclick = () => {
      body.classList.toggle('expanded');
      header.querySelector('.spec-toggle-icon').classList.toggle('rotate');
    };

    sectionEl.appendChild(header);
    sectionEl.appendChild(body);
    content.appendChild(sectionEl);
  }
}

new Spec();
