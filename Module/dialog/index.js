/**
 * 路徑: ./Module/dialog/index.js
 * 檔名: index.js
 * 功能: 顯示 Dialog，支援動畫、延遲、自動消失
 * 修改日期: 20250922
 */
import { EventBus } from '../../eventBus.js';
import config from './config.json';

export class Dialog extends EventBus {
  constructor() {
    super();
    this.moduleName = config.module;
    this.handlers = {
      renderDialog: this.renderDialog.bind(this)
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

  renderDialog({ message, buttons = [], delay = 0, autoClose = 0 }) {
    const box = document.getElementById('dialogBox');
    const overlay = document.getElementById('dialogOverlay');
    const content = document.getElementById('dialogContent');
    const btnArea = document.getElementById('dialogButtons');

    content.textContent = message;
    btnArea.innerHTML = '';
    box.classList.remove('hidden');
    overlay.classList.remove('hidden');

    setTimeout(() => {
      box.classList.add('active');
      overlay.classList.add('active');
    }, 10);

    if (buttons.length === 0 && autoClose > 0) {
      setTimeout(() => this.closeDialog(), autoClose);
      return;
    }

    setTimeout(() => {
      buttons.forEach(({ label, result, cancel }) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.classList.add('visible');
        if (cancel) btn.classList.add('cancel');
        btn.onclick = () => {
          this.delegate('dialog:response', { result });
          this.closeDialog();
        };
        btnArea.appendChild(btn);
      });
    }, delay);
  }

  closeDialog() {
    const box = document.getElementById('dialogBox');
    const overlay = document.getElementById('dialogOverlay');
    box.classList.remove('active');
    overlay.classList.remove('active');
    setTimeout(() => {
      box.classList.add('hidden');
      overlay.classList.add('hidden');
    }, 300);
  }
}

new Dialog();
