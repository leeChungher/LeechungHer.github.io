const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const floatingBar = document.getElementById('floatingBar');
const topBar = document.getElementById('topBar');
const main = document.getElementById('main');
const dynamicMenu = document.getElementById('sidebar-dynamic');
const customPage = document.getElementById('custom');

let startX = null;
let startY = null;
let isDragging = false;
let justDragged = false;
let touchYStart = null;

function showSidebar() {
  sidebar.style.left = '0px';
  overlay.style.display = 'block';
}

function hideSidebar() {
  sidebar.style.left = `-${getComputedStyle(sidebar).width}`;
  overlay.style.display = 'none';
}

function showFloatingBar() {
  floatingBar.classList.remove('hidden');
}

function hideFloatingBar() {
  floatingBar.classList.add('hidden');
}

function showTopBar() {
  topBar.classList.remove('hidden');
  main.style.paddingTop = '0px'; // ✅ 不留白
}

function hideTopBar() {
  topBar.classList.add('hidden');
  main.style.paddingTop = '0px'; // ✅ 保持一致
}

function updateFloatingBar(items) {
  floatingBar.innerHTML = items
    .map(item =>
      `<button onclick="showCustomPage('${item.label}', '${item.content.replace(/'/g, "\\'")}')">${item.label}</button>`
    )
    .join('');
}

function updateSidebarMenu(pageId) {
  const menuData = {
    home: [
      { icon: '<i class="fas fa-newspaper"></i>', label: '最新消息', content: '這是首頁的最新消息內容。' },
      { icon: '<i class="fas fa-fire"></i>', label: '熱門活動', content: '這是首頁的熱門活動介紹。' }
    ],
    contact: [
      { icon: '<i class="fas fa-headset"></i>', label: '客服中心', content: '這裡是客服中心的說明與聯絡方式。' },
      { icon: '<i class="fas fa-envelope"></i>', label: '聯絡表單', content: '請填寫以下聯絡表單與我們聯繫。' }
    ],
    gallery: [
      { icon: '<i class="fas fa-folder-open"></i>', label: '相簿分類', content: '這裡是圖庫的分類列表。' },
      { icon: '<i class="fas fa-upload"></i>', label: '上傳圖片', content: '請選擇圖片並上傳至圖庫。' }
    ],
    about: [
      { icon: '<i class="fas fa-users"></i>', label: '團隊介紹', content: '我們是一群熱愛創新的團隊。' },
      { icon: '<i class="fas fa-scroll"></i>', label: '歷史沿革', content: '這是我們的發展歷程與重要里程碑。' }
    ],
    services: [
      { icon: '<i class="fas fa-cogs"></i>', label: '服務項目', content: '我們提供多元的專業服務。' },
      { icon: '<i class="fas fa-dollar-sign"></i>', label: '報價方案', content: '以下是我們的服務收費標準。' }
    ]
  };

  const items = menuData[pageId] || [];
  dynamicMenu.innerHTML = items
    .map(item =>
      `<li onclick="showCustomPage('${item.label}', '${item.content.replace(/'/g, "\\'")}')">
        ${item.icon}<span>${item.label}</span>
      </li>`
    )
    .join('');

  updateFloatingBar(items);
}

function showCustomPage(title, content) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  customPage.innerHTML = `<h2>${title}</h2><p>${content}</p>`;
  customPage.classList.add('active');
  hideSidebar();
}

function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  updateSidebarMenu(pageId);
  customPage.innerHTML = '';
  showFloatingBar();
  showTopBar();
  hideSidebar();
}

main.addEventListener('click', () => {
  if (justDragged) {
    justDragged = false;
    return;
  }
  hideSidebar();
});

overlay.addEventListener('click', hideSidebar);
sidebar.addEventListener('click', e => e.stopPropagation());

document.body.addEventListener('mousedown', e => {
  startX = e.clientX;
  startY = e.clientY;
  isDragging = true;
});

document.body.addEventListener('mouseup', e => {
  if (!isDragging || startX === null || startY === null) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;

  if (deltaX > 50) {
    showSidebar();
    justDragged = true;
  } else if (deltaX < -50) {
    hideSidebar();
    justDragged = true;
  }

  if (deltaY > 30) {
    showFloatingBar();
    showTopBar();
  } else if (deltaY < -30) {
    hideFloatingBar();
    hideTopBar();
  }

  startX = null;
  startY = null;
  isDragging = false;
});

document.body.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  touchYStart = e.touches[0].clientY;
});

document.body.addEventListener('touchend', e => {
  const deltaX = e.changedTouches[0].clientX - startX;
  const deltaY = e.changedTouches[0].clientY - touchYStart;

  if (deltaX > 50) {
    showSidebar();
    justDragged = true;
  } else if (deltaX < -50) {
    hideSidebar();
    justDragged = true;
  }

  if (deltaY > 30) {
    showFloatingBar();
    showTopBar();
  } else if (deltaY < -30) {
    hideFloatingBar();
    hideTopBar();
  }

  startX = null;
  touchYStart = null;
});

/* 滾動控制浮動列與 TopBar 顯示／隱藏 */
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
  const st = window.scrollY || document.documentElement.scrollTop;
  if (st > lastScrollTop + 10) {
    hideFloatingBar();
    hideTopBar();
  } else if (st < lastScrollTop - 10) {
    showFloatingBar();
    showTopBar();
  }
  lastScrollTop = st <= 0 ? 0 : st;
});

window.navigate = navigate;
window.showCustomPage = showCustomPage;

window.onload = () => {
  navigate('home');
};
