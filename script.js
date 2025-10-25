function onScanSuccess(decodedText, decodedResult) {
  document.getElementById('result').innerText = `✅ 掃描成功：${decodedText}`;
}

function onScanFailure(error) {
  // 可選：顯示錯誤或忽略
}

const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start(
  { facingMode: "environment" }, // 使用後鏡頭
  {
    fps: 10,
    qrbox: 250
  },
  onScanSuccess,
  onScanFailure
);