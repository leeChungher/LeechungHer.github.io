class QRCodeScanner {
    constructor() {
        this.html5QrcodeScanner = null;
        this.scanHistory = [];
        this.maxHistoryItems = 10;
        
        // DOM 元素
        this.resultElement = document.getElementById('result');
        this.historyElement = document.getElementById('scanHistory');
        this.startButton = document.getElementById('startButton');
        this.stopButton = document.getElementById('stopButton');
        
        // 綁定按鈕事件
        this.startButton.addEventListener('click', () => this.startScanning());
        this.stopButton.addEventListener('click', () => this.stopScanning());
        
        // 初始化掃描器
        this.initializeScanner();
    }

    initializeScanner() {
        this.html5QrcodeScanner = new Html5Qrcode("reader");
    }

    startScanning() {
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        this.html5QrcodeScanner.start(
            { facingMode: "environment" },
            config,
            this.onScanSuccess.bind(this),
            this.onScanError.bind(this)
        )
        .then(() => {
            this.startButton.disabled = true;
            this.stopButton.disabled = false;
            this.updateResult("掃描中...");
        })
        .catch(err => {
            console.error("掃描器啟動失敗:", err);
            this.updateResult("無法啟動相機，請確認權限設定");
        });
    }

    stopScanning() {
        this.html5QrcodeScanner.stop()
        .then(() => {
            this.startButton.disabled = false;
            this.stopButton.disabled = true;
            this.updateResult("掃描已停止");
        })
        .catch(err => {
            console.error("停止掃描時發生錯誤:", err);
        });
    }

    onScanSuccess(decodedText, decodedResult) {
        this.updateResult(decodedText);
        this.addToHistory(decodedText);
        
        // 播放成功音效
        this.playSuccessSound();
        
        // 震動回饋（如果設備支援）
        if (navigator.vibrate) {
            navigator.vibrate(200);
        }
    }

    onScanError(error) {
        // 我們不需要在每次掃描失敗時都更新 UI
        console.debug("掃描錯誤:", error);
    }

    updateResult(text) {
        this.resultElement.textContent = text;
        
        // 如果是成功掃描結果，添加視覺效果
        if (text !== "掃描中..." && text !== "掃描已停止") {
            this.resultElement.style.backgroundColor = "#e8f5e9";
            setTimeout(() => {
                this.resultElement.style.backgroundColor = "#f8f9fa";
            }, 1500);
        }
    }

    addToHistory(text) {
        const timestamp = new Date().toLocaleTimeString();
        this.scanHistory.unshift({ text, timestamp });
        
        // 限制歷史記錄數量
        if (this.scanHistory.length > this.maxHistoryItems) {
            this.scanHistory.pop();
        }
        
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        this.historyElement.innerHTML = this.scanHistory
            .map(item => `<li>${item.timestamp}: ${item.text}</li>`)
            .join('');
    }

    playSuccessSound() {
        // 建立簡單的成功音效
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.stop(audioContext.currentTime + 0.2);
    }
}

// 當 DOM 載入完成後初始化掃描器
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeScanner();
});