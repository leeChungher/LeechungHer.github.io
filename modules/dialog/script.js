import ControlCenter from '../../Core/ControlCenter.js';
import Base from '../../Utils/Base.js';

class Dialog {
    constructor() {
        this.template = document.getElementById('dialog-template');
        this.resultBox = document.getElementById('result');
        this.activeDialog = null;
        this.bindGlobalFunctions();
    }

    bindGlobalFunctions() {
        // 綁定全局函數到 window 對象
        window.showAlert = this.showAlert.bind(this);
        window.showConfirm = this.showConfirm.bind(this);
        window.showPrompt = this.showPrompt.bind(this);
        window.showCustomDialog = this.showCustomDialog.bind(this);
    }

    createDialog() {
        const template = this.template.content.cloneNode(true);
        const dialog = template.querySelector('.dialog-overlay');
        document.body.appendChild(dialog);
        
        // 綁定關閉按鈕
        const closeBtn = dialog.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.closeDialog(dialog));
        
        // 點擊遮罩層關閉
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                this.closeDialog(dialog);
            }
        });

        return dialog;
    }

    closeDialog(dialog) {
        dialog.addEventListener('animationend', () => {
            document.body.removeChild(dialog);
        });
        dialog.style.animation = 'fadeIn 0.3s ease-out reverse';
    }

    showAlert(message = '這是一個警告訊息') {
        const dialog = this.createDialog();
        const container = dialog.querySelector('.dialog-container');
        
        container.querySelector('.dialog-header h3').textContent = '警告';
        container.querySelector('.dialog-content').textContent = message;
        
        const footer = container.querySelector('.dialog-footer');
        const okBtn = document.createElement('button');
        okBtn.textContent = '確定';
        okBtn.addEventListener('click', () => this.closeDialog(dialog));
        footer.appendChild(okBtn);

        this.logAction('顯示警告對話框');
    }

    showConfirm(message = '請確認此操作') {
        const dialog = this.createDialog();
        const container = dialog.querySelector('.dialog-container');
        
        container.querySelector('.dialog-header h3').textContent = '確認';
        container.querySelector('.dialog-content').textContent = message;
        
        const footer = container.querySelector('.dialog-footer');
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.backgroundColor = '#95a5a6';
        cancelBtn.addEventListener('click', () => {
            this.logAction('使用者取消操作');
            this.closeDialog(dialog);
        });
        
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '確定';
        confirmBtn.addEventListener('click', () => {
            this.logAction('使用者確認操作');
            this.closeDialog(dialog);
        });
        
        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);
    }

    showPrompt(message = '請輸入', defaultValue = '') {
        const dialog = this.createDialog();
        const container = dialog.querySelector('.dialog-container');
        
        container.querySelector('.dialog-header h3').textContent = '輸入';
        
        const content = container.querySelector('.dialog-content');
        content.innerHTML = `
            <p>${message}</p>
            <input type="text" value="${defaultValue}" style="width: 100%; margin-top: 10px; padding: 5px;">
        `;
        
        const input = content.querySelector('input');
        
        const footer = container.querySelector('.dialog-footer');
        
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.style.backgroundColor = '#95a5a6';
        cancelBtn.addEventListener('click', () => {
            this.logAction('使用者取消輸入');
            this.closeDialog(dialog);
        });
        
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '確定';
        confirmBtn.addEventListener('click', () => {
            this.logAction(`使用者輸入: ${input.value}`);
            this.closeDialog(dialog);
        });
        
        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);
        
        // 自動聚焦輸入框
        setTimeout(() => input.focus(), 100);
    }

    showCustomDialog(type) {
        const dialog = this.createDialog();
        const container = dialog.querySelector('.dialog-container');
        container.classList.add(`dialog-${type}`);
        
        let title, message;
        switch(type) {
            case 'info':
                title = '資訊';
                message = '這是一個資訊提示';
                break;
            case 'success':
                title = '成功';
                message = '操作已成功完成';
                break;
            case 'error':
                title = '錯誤';
                message = '發生了一個錯誤';
                break;
        }
        
        container.querySelector('.dialog-header h3').textContent = title;
        container.querySelector('.dialog-content').textContent = message;
        
        const footer = container.querySelector('.dialog-footer');
        const okBtn = document.createElement('button');
        okBtn.textContent = '確定';
        okBtn.addEventListener('click', () => this.closeDialog(dialog));
        footer.appendChild(okBtn);

        this.logAction(`顯示${title}對話框`);
    }

    logAction(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.resultBox.innerHTML += `<p>[${timestamp}] ${message}</p>`;
        this.resultBox.scrollTop = this.resultBox.scrollHeight;
        
        // 發送事件到控制中心
        ControlCenter.emit('dialog:action', {
            timestamp: new Date(),
            message
        });
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new Dialog();
});