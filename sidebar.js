const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuBtn = document.getElementById('menuBtn');

let isOpen = false;
let isMouseDown = false;
let mouseDownX = 0;
let mouseUpX = 0;
let touchStartX = 0;
let touchEndX = 0;

function openSidebar() {
  sidebar.classList.add('active');
  overlay.classList.add('active');
  isOpen = true;
}

function closeSidebar() {
  sidebar.classList.remove('active');
  overlay.classList.remove('active');
  document.querySelectorAll('.has-submenu').forEach(item => item.classList.remove('open'));
  isOpen = false;
}

menuBtn.onclick = () => openSidebar();
overlay.onclick = () => closeSidebar();

document.querySelectorAll('.has-submenu').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-page]');
  if (target) {
    const page = target.getAttribute('data-page');
    if (page) renderTable(page);
    closeSidebar();
  }
});

document.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  mouseDownX = e.clientX;
});

document.addEventListener('mouseup', (e) => {
  if (!isMouseDown) return;
  isMouseDown = false;
  mouseUpX = e.clientX;
  const dragDistance = mouseUpX - mouseDownX;
  if (!isOpen && dragDistance > 60) openSidebar();
  if (isOpen && dragDistance < -60) closeSidebar();
});

document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
});

document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].clientX;
  const swipeDistance = touchEndX - touchStartX;
  if (!isOpen && swipeDistance > 60) openSidebar();
  if (isOpen && swipeDistance < -60) closeSidebar();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSidebar();
  }
});