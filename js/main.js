// 檔名: js/main.js

import { Common } from './common/common.js';

// 插入 Demo 主結構
const app = document.getElementById('app');
Common.loadHtml('js/demo/layout.html', app);

// 載入 Demo 控制器（建立選單、載入模組）
import('./demo/demo.js');