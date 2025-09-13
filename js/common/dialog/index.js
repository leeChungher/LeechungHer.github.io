const Dialog = (() => {
  let initialized = false;
  let container;

  function init() {
    if (initialized) return;
    initialized = true;

    container = document.createElement('div');
    container.id = 'dialog-container';
    document.body.appendChild(container);

    Common.loadHtml('js/common/dialog/layout.html', container);
    Common.loadCss('js/common/dialog/style.css');
  }

  function show({ title, message, buttons = ['確定'], input = false, onConfirm, onCancel }) {
    init();

    setTimeout(() => {
      const titleEl = container.querySelector('.dialog-title');
      const messageEl = container.querySelector('.dialog-message');
      const inputEl = container.querySelector('.dialog-input');
      const btnWrap = container.querySelector('.dialog-buttons');

      titleEl.textContent = title;
      messageEl.textContent = message;

      inputEl.style.display = input ? 'block' : 'none';
      inputEl.value = '';

      btnWrap.innerHTML = '';

      const confirmBtn = document.createElement('button');
      confirmBtn.textContent = buttons[0];
      confirmBtn.onclick = () => {
        hide(() => {
          input ? onConfirm?.(inputEl.value) : onConfirm?.();
        });
      };
      btnWrap.appendChild(confirmBtn);

      if (buttons.length === 2) {
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = buttons[1];
        cancelBtn.onclick = () => {
          hide(() => {
            onCancel?.();
          });
        };
        btnWrap.appendChild(cancelBtn);
      }

      container.classList.remove('fade-out');
      container.style.opacity = '1';
      container.style.display = 'block';
    }, 50);
  }

  function hide(callback, delay = 300) {
    if (!container) return;

    container.classList.add('fade-out');
    setTimeout(() => {
      container.remove();
      container = null;
      initialized = false;
      callback?.();
    }, delay);
  }

  return {
    show,
    hide,
    alert(title, message) {
      return new Promise(resolve => {
        show({ title, message, buttons: ['好'], onConfirm: resolve });
      });
    },
    confirm(title, message, buttons = ['是', '否']) {
      return new Promise(resolve => {
        show({
          title,
          message,
          buttons,
          onConfirm: () => resolve(buttons[0]),
          onCancel: () => resolve(buttons[1])
        });
      });
    },
    prompt(title, message) {
      return new Promise(resolve => {
        show({
          title,
          message,
          buttons: ['送出', '取消'],
          input: true,
          onConfirm: val => resolve(val),
          onCancel: () => resolve(null)
        });
      });
    }
  };
})();
