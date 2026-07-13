document.addEventListener('DOMContentLoaded', function() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    if (!scrollBtn) return;
    
    // Показываем кнопку при прокрутке вниз
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) { // Показываем после 500px прокрутки
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Плавный скролл наверх при клике
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Плавная прокрутка
        });
    });
    
    // Проверяем позицию при загрузке страницы
    if (window.scrollY > 500) {
        scrollBtn.classList.add('visible');
    }
});