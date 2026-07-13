// ========== МАСКА ТЕЛЕФОНА С ПРАВИЛЬНЫМ УДАЛЕНИЕМ ==========
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.querySelector('input[name="phone"]');
    
    if (phoneInput) {
        // Сохраняем позицию курсора
        let cursorPosition = 0;
        
        phoneInput.addEventListener('input', function(e) {
            const input = e.target;
            const oldValue = input.value;
            const oldLength = oldValue.length;
            
            // Сохраняем позицию курсора до изменения
            cursorPosition = input.selectionStart || 0;
            
            // Получаем только цифры из введенного значения
            let digits = input.value.replace(/\D/g, '');
            
            // Ограничиваем до 11 цифр
            if (digits.length > 11) {
                digits = digits.slice(0, 11);
            }
            
            // Форматируем номер
            let formattedValue = formatPhoneNumber(digits);
            
            // Устанавливаем новое значение
            input.value = formattedValue;
            
            // Восстанавливаем позицию курсора
            const newLength = formattedValue.length;
            const lengthDiff = newLength - oldLength;
            
            // Корректируем позицию курсора
            if (lengthDiff > 0) {
                // Добавление символов - курсор двигается вперед
                cursorPosition = Math.min(cursorPosition + lengthDiff, newLength);
            } else if (lengthDiff < 0) {
                // Удаление символов - курсор остается или двигается назад
                cursorPosition = Math.max(0, cursorPosition + lengthDiff);
            }
            
            // Устанавливаем курсор в правильную позицию
            setTimeout(() => {
                input.setSelectionRange(cursorPosition, cursorPosition);
            }, 0);
        });
        
        // Обработка клавиш Backspace и Delete
        phoneInput.addEventListener('keydown', function(e) {
            const input = e.target;
            const start = input.selectionStart || 0;
            const end = input.selectionEnd || 0;
            
            // Если выделен текст, удаляем его
            if (start !== end) {
                return; // Позволяем стандартному поведению удалить выделенный текст
            }
            
            // Обработка Backspace
            if (e.key === 'Backspace') {
                const cursorPos = start;
                const currentValue = input.value;
                
                // Если курсор в начале поля - ничего не делаем
                if (cursorPos === 0) {
                    e.preventDefault();
                    return;
                }
                
                // Проверяем символ перед курсором
                const charBeforeCursor = currentValue[cursorPos - 1];
                
                // Если перед курсором спецсимвол, удаляем его и цифру
                if (charBeforeCursor === '(' || charBeforeCursor === ')' || 
                    charBeforeCursor === '-' || charBeforeCursor === ' ') {
                    
                    e.preventDefault();
                    
                    // Находим предыдущую цифру
                    let newCursorPos = cursorPos - 1;
                    while (newCursorPos > 0 && 
                           (currentValue[newCursorPos] === '(' || 
                            currentValue[newCursorPos] === ')' || 
                            currentValue[newCursorPos] === '-' || 
                            currentValue[newCursorPos] === ' ')) {
                        newCursorPos--;
                    }
                    
                    // Формируем новое значение
                    let digits = currentValue.replace(/\D/g, '');
                    digits = digits.slice(0, -1); // Удаляем последнюю цифру
                    
                    input.value = formatPhoneNumber(digits);
                    
                    // Устанавливаем курсор после удаления
                    setTimeout(() => {
                        const newPos = Math.min(newCursorPos, input.value.length);
                        input.setSelectionRange(newPos, newPos);
                    }, 0);
                }
            }
        });
        
        // Обработка Delete
        phoneInput.addEventListener('keydown', function(e) {
            if (e.key === 'Delete') {
                const input = e.target;
                const start = input.selectionStart || 0;
                const end = input.selectionEnd || 0;
                
                if (start !== end) return;
                
                const currentValue = input.value;
                
                // Если курсор в конце поля - ничего не делаем
                if (start >= currentValue.length) {
                    e.preventDefault();
                    return;
                }
                
                // Проверяем символ после курсора
                const charAfterCursor = currentValue[start];
                
                // Если после курсора спецсимвол, удаляем его и следующую цифру
                if (charAfterCursor === '(' || charAfterCursor === ')' || 
                    charAfterCursor === '-' || charAfterCursor === ' ') {
                    
                    e.preventDefault();
                    
                    // Находим следующую цифру
                    let nextDigitPos = start + 1;
                    while (nextDigitPos < currentValue.length && 
                           (currentValue[nextDigitPos] === '(' || 
                            currentValue[nextDigitPos] === ')' || 
                            currentValue[nextDigitPos] === '-' || 
                            currentValue[nextDigitPos] === ' ')) {
                        nextDigitPos++;
                    }
                    
                    // Формируем новое значение
                    let digits = currentValue.replace(/\D/g, '');
                    
                    // Определяем индекс цифры для удаления
                    let digitIndex = 0;
                    let pos = 0;
                    for (let i = 0; i < currentValue.length; i++) {
                        if (/\d/.test(currentValue[i])) {
                            if (i >= nextDigitPos) {
                                break;
                            }
                            digitIndex++;
                        }
                    }
                    
                    digits = digits.slice(0, digitIndex - 1) + digits.slice(digitIndex);
                    
                    input.value = formatPhoneNumber(digits);
                    
                    // Устанавливаем курсор
                    setTimeout(() => {
                        input.setSelectionRange(start, start);
                    }, 0);
                }
            }
        });
    }
    
    // ========== ФУНКЦИЯ ФОРМАТИРОВАНИЯ ТЕЛЕФОНА ==========
    function formatPhoneNumber(digits) {
        if (!digits || digits.length === 0) {
            return '';
        }
        
        // Убеждаемся, что номер начинается с 7
        if (digits[0] === '8' || digits[0] === '7') {
            digits = '7' + digits.slice(1);
        } else {
            digits = '7' + digits;
        }
        
        let formatted = '+7';
        
        if (digits.length > 1) {
            formatted += ' (' + digits.slice(1, 4);
        }
        if (digits.length >= 4) {
            formatted += ') ' + digits.slice(4, 7);
        }
        if (digits.length >= 7) {
            formatted += '-' + digits.slice(7, 9);
        }
        if (digits.length >= 9) {
            formatted += '-' + digits.slice(9, 11);
        }
        
        return formatted;
    }
    
    // ========== ДОБАВЛЕНИЕ СЧЕТЧИКОВ СИМВОЛОВ ==========
    addCharacterCounters();
    
    // ========== ВАЛИДАЦИЯ ФОРМЫ ==========
    const contactForm = document.querySelector('.simple-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Валидация перед отправкой
            if (!validateForm()) {
                return;
            }
            
            // Показываем уведомление о начале отправки
            showNotification('⏳ Отправка...', 'info');

            // Отправка через FormSubmit
            fetch(contactForm.action, {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(contactForm)
            })
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error('Request failed');
                    }
                    return response.json();
                })
                .then(function(data) {
                    console.log('✅ Успешно отправлено!', data);
                    showNotification('✅ Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                    contactForm.reset(); // Очищаем форму после успешной отправки

                    // Сбрасываем счетчики
                    resetCounters();
                })
                .catch(function(error) {
                    console.error('❌ Ошибка отправки:', error);
                    showNotification('❌ Ошибка при отправке. Пожалуйста, попробуйте позже или позвоните нам.', 'error');
                });
        });
    }
});

// ========== ФУНКЦИЯ ДЛЯ ДОБАВЛЕНИЯ СЧЕТЧИКОВ ==========
function addCharacterCounters() {
    // Счетчик для имени (макс 25 символов)
    const nameInput = document.querySelector('input[name="name"]');
    if (nameInput) {
        nameInput.maxLength = 25;
        
        const nameCounter = document.createElement('div');
        nameCounter.className = 'char-counter name-counter';
        nameCounter.style.cssText = `
            font-size: 0.75rem;
            color: var(--gray-text);
            text-align: right;
            margin-top: 4px;
            opacity: 0.7;
        `;
        nameInput.parentNode.insertBefore(nameCounter, nameInput.nextSibling);
        
        nameInput.addEventListener('input', function() {
            const remaining = 25 - this.value.length;
            nameCounter.textContent = `${remaining}/25 символов`;
            nameCounter.style.color = remaining < 5 ? '#e74c3c' : 'var(--gray-text)';
        });
        
        // Инициализация счетчика
        nameInput.dispatchEvent(new Event('input'));
    }
    
    // Счетчик для сообщения (макс 500 символов)
    const messageInput = document.querySelector('textarea[name="message"]');
    if (messageInput) {
        messageInput.maxLength = 500;
        
        const messageCounter = document.createElement('div');
        messageCounter.className = 'char-counter message-counter';
        messageCounter.style.cssText = `
            font-size: 0.75rem;
            color: var(--gray-text);
            text-align: right;
            margin-top: 4px;
            opacity: 0.7;
        `;
        messageInput.parentNode.insertBefore(messageCounter, messageInput.nextSibling);
        
        messageInput.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            messageCounter.textContent = `${remaining}/500 символов`;
            messageCounter.style.color = remaining < 50 ? '#e74c3c' : 'var(--gray-text)';
        });
        
        // Инициализация счетчика
        messageInput.dispatchEvent(new Event('input'));
    }
}

// ========== ФУНКЦИЯ ДЛЯ СБРОСА СЧЕТЧИКОВ ==========
function resetCounters() {
    const nameCounter = document.querySelector('.name-counter');
    const messageCounter = document.querySelector('.message-counter');
    
    if (nameCounter) nameCounter.textContent = '25/25 символов';
    if (messageCounter) messageCounter.textContent = '500/500 символов';
}

// ========== ФУНКЦИЯ ВАЛИДАЦИИ ФОРМЫ ==========
function validateForm() {
    const nameInput = document.querySelector('input[name="name"]');
    const phoneInput = document.querySelector('input[name="phone"]');
    const messageInput = document.querySelector('textarea[name="message"]');
    
    // Проверка имени
    if (!nameInput || !nameInput.value.trim()) {
        showNotification('❌ Пожалуйста, введите ваше имя', 'error');
        nameInput?.focus();
        return false;
    }
    
    if (nameInput.value.length > 25) {
        showNotification('❌ Имя не должно превышать 25 символов', 'error');
        nameInput.focus();
        return false;
    }
    
    // Проверка телефона
    if (!phoneInput || !phoneInput.value.trim()) {
        showNotification('❌ Пожалуйста, введите номер телефона', 'error');
        phoneInput?.focus();
        return false;
    }
    
    // Проверка формата телефона (должно быть минимум 10 цифр)
    const phoneDigits = phoneInput.value.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
        showNotification('❌ Пожалуйста, введите корректный номер телефона', 'error');
        phoneInput.focus();
        return false;
    }
    
    // Проверка сообщения
    if (messageInput && messageInput.value.length > 500) {
        showNotification('❌ Сообщение не должно превышать 500 символов', 'error');
        messageInput.focus();
        return false;
    }
    
    return true;
}

// ========== ФУНКЦИЯ ДЛЯ ПОКАЗА УВЕДОМЛЕНИЙ ==========
function showNotification(message, type) {
    const existingNotification = document.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        padding: 12px 20px;
        margin-top: 20px;
        border-radius: 60px;
        font-size: 0.95rem;
        font-weight: 500;
        text-align: center;
        animation: notificationFadeIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    `;
    
    if (type === 'success') {
        notification.style.backgroundColor = '#d4edda';
        notification.style.color = '#155724';
        notification.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f8d7da';
        notification.style.color = '#721c24';
        notification.style.border = '1px solid #f5c6cb';
    } else {
        notification.style.backgroundColor = '#e2f0fa';
        notification.style.color = '#004c8c';
        notification.style.border = '1px solid #b8daff';
    }
    
    const form = document.querySelector('.simple-form');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(notification, form.nextSibling);
    }
    
    if (type !== 'info') {
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }
}

// Добавляем анимацию для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes notificationFadeIn {
        from { 
            opacity: 0; 
            transform: translateY(-10px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
`;
document.head.appendChild(style);