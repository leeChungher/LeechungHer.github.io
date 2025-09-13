export default function () {
  document.getElementById('btn-alert').onclick = async () => {
    await Dialog.alert('提示', '這是 Alert 測試');
  };

  document.getElementById('btn-confirm').onclick = async () => {
    const result = await Dialog.confirm('確認', '你要繼續嗎？', ['是', '否']);
    alert('你選擇了：' + result);
  };

  document.getElementById('btn-prompt').onclick = async () => {
    const name = await Dialog.prompt('請輸入名稱', '這個名稱將用於建立模組');
    if (name) {
      alert('你輸入的是：' + name);
    } else {
      alert('你取消了輸入');
    }
  };
}
