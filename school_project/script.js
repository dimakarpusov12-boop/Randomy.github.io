// Элементы DOM
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');
const modeButtons = document.querySelectorAll('.mode-btn');
const modePanels = document.querySelectorAll('.mode-panel');

// Элементы для режима счастливого билета
const ticketNumber = document.getElementById('ticketNumber');
const ticketStatus = document.getElementById('ticketStatus');

// Данные пресетов для списка
const listPresets = {
yesno: ['Да', 'Нет'],
numbers: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
alphabet: ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'],
colors: ['Красный', 'Синий', 'Зелёный', 'Жёлтый', 'Фиолетовый', 'Оранжевый', 'Розовый', 'Чёрный', 'Белый', 'Серый'],
zodiac: ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы']
};

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
// Устанавливаем значения по умолчанию для чисел
const minNum = document.getElementById('minNum');
const maxNum = document.getElementById('maxNum');
if (minNum) minNum.value = '1';
if (maxNum) maxNum.value = '100';

setupModeSwitching();
setupNumberMode();
setupCustomListMode();
setupLuckyTicketMode();
});

// Функция переключения режимов
function setupModeSwitching() {
modeButtons.forEach(button => {
button.addEventListener('click', () => {
const targetMode = button.getAttribute('data-mode');

// Убираем активный класс у всех кнопок и панелей
modeButtons.forEach(btn => btn.classList.remove('active'));
modePanels.forEach(panel => panel.classList.remove('active'));

// Добавляем активный класс текущей кнопке и панели
button.classList.add('active');
document.getElementById(targetMode + 'Mode').classList.add('active');

// Скрываем сообщения при переключении режимов
hideMessages();
});
});
}

// Режим чисел
function setupNumberMode() {
const generateBtn = document.getElementById('generateBtn');
const minNum = document.getElementById('minNum');
const maxNum = document.getElementById('maxNum');

generateBtn.addEventListener('click', () => {
// Валидация ввода
if (!validateNumberInput(minNum, 1, 999999) || !validateNumberInput(maxNum, 1, 1000000)) {
showError('Проверьте корректность введённых чисел');
return;
}

const min = parseInt(minNum.value);
const max = parseInt(maxNum.value);

if (min > max) {
showError('Минимальное число не может быть больше максимального');
return;
}

// Генерация случайного числа
const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
showResult(`Случайное число: <strong>${randomNumber}</strong>`, 'success-msg');
});
}

// Режим пользовательского списка
function setupCustomListMode() {
const listBtn = document.getElementById('listBtn');
const itemsTextarea = document.getElementById('userList'); // Исправлено: было 'itemsTextarea'
const clearListBtn = document.getElementById('clearListBtn');

// Проверка существования всех необходимых элементов
if (!listBtn || !itemsTextarea || !clearListBtn) {
console.error('Не все элементы DOM найдены для режима пользовательского списка');
return;
}

listBtn.addEventListener('click', () => {
const items = itemsTextarea.value.trim().split(',').map(item => item.trim()).filter(item => item !== '');

if (items.length === 0) {
showError('Введите хотя бы один элемент в списке');
return;
}

// Случайный выбор элемента
const randomItem = items[Math.floor(Math.random() * items.length)];
showResult(`Выбранный элемент: <strong>${randomItem}</strong>`, 'success-msg');

// Обновление превью
updateListPreview(items);
});

// Настройка пресетов
setupPresets(itemsTextarea);

// Очистка списка
clearListBtn.addEventListener('click', () => {
itemsTextarea.value = '';
updateListPreview([]);
hideMessages();
});
}

/**
* Настройка кнопок пресетов
* @param {HTMLTextAreaElement} itemsTextarea - текстовое поле для списка
*/
function setupPresets(itemsTextarea) {
// Используем точный селектор для кнопок пресетов
const presetButtons = document.querySelectorAll('.preset-btn[data-preset]');

if (presetButtons.length === 0) {
console.warn('Кнопки пресетов не найдены на странице');
return;
}

presetButtons.forEach(btn => {
btn.addEventListener('click', function(e) {
e.preventDefault(); // Предотвращаем стандартное поведение
e.stopPropagation(); // Останавливаем всплытие события

const presetName = this.getAttribute('data-preset');

// Проверка существования пресета
if (!presetName || !listPresets[presetName]) {
console.error(`Пресет "${presetName}" не найден в listPresets`);
showError(`Пресет "${presetName}" недоступен`);
return;
}

const presetItems = listPresets[presetName];

itemsTextarea.value = presetItems.join(', '); // Разделитель — запятая с пробелом
updateListPreview(presetItems);
showResult(`Загружен пресет: <strong>${getPresetDisplayName(presetName)}</strong>`, 'info-msg');
setTimeout(hideMessages, 2000);
});
});
}

/**
* Получает читаемое название пресета для отображения
* @param {string} presetKey - ключ пресета
* @returns {string} - читаемое название
*/
function getPresetDisplayName(presetKey) {
const names = {
'yesno': 'Да/Нет',
'numbers': 'Числа 1–10',
'alphabet': 'Русский алфавит',
'colors': 'Цвета',
'zodiac': 'Знаки зодиака'
};
return names[presetKey] || presetKey;
}

function updateListPreview(items) {
const previewList = document.getElementById('listPreview');
if (!previewList) return;

const itemsList = previewList; // В HTML уже есть контейнер с классом items-list
const previewCount = document.querySelector('.preview-count');

if (itemsList) {
itemsList.innerHTML = '';
items.forEach(item => {
const div = document.createElement('div');
div.className = 'preview-item';
div.textContent = item;
itemsList.appendChild(div);
});

if (previewCount) {
previewCount.textContent = `Всего элементов: ${items.length}`;
}
document.querySelector('.list-preview').classList.toggle('hidden', items.length === 0);
} else {
console.warn('Элементы itemsList или previewCount не найдены в previewList');
}
}

// Режим счастливого билета
function setupLuckyTicketMode() {
const generateLuckyBtn = document.getElementById('generateLucky');

generateLuckyBtn.addEventListener('click', () => {
// Сразу генерируем и показываем номер (без задержки)
ticketNumber.textContent = generateTicketNumber();

const isLucky = checkLuckyTicket(ticketNumber.textContent);
if (isLucky) {
showResult(`Счастливый билет! 🎉<br>Номер: <strong>${ticketNumber.textContent}</strong>`, 'happy');
ticketStatus.textContent = 'Счастливый билет!'
ticketStatus.className = 'happy';
} else {
showResult(`Обычный билет<br>Номер: <strong>${ticketNumber.textContent}</strong>`);
ticketStatus.textContent = 'Обычный билет';
ticketStatus.className = 'normal';
}
});

// Сброс режима счастливого билета
const resetBtn = document.querySelector('#luckyMode .reset-btn');
if (resetBtn) {
resetBtn.addEventListener('click', () => {
ticketNumber.textContent = '000000';
ticketStatus.textContent = 'Обычный билет';
ticketStatus.className = 'normal';
hideMessages();
});
}
}

// Вспомогательные функции
function generateTicketNumber() {
let number = '';
for (let i = 0; i < 6; i++) {
number += Math.floor(Math.random() * 10);
}
return number;
}

function checkLuckyTicket(number) {
const digits = number.toString().split('').map(Number);
const sumFirstHalf = digits[0] + digits[1] + digits[2];
const sumSecondHalf = digits[3] + digits[4] + digits[5];
return sumFirstHalf === sumSecondHalf;
}

function showResult(message, className = 'normal') {
resultDiv.innerHTML = message;
resultDiv.className = `result ${className}`;
resultDiv.classList.remove('hidden');
errorDiv.classList.add('hidden');
}

function showError(message) {
errorDiv.textContent = message;
errorDiv.classList.remove('hidden');
resultDiv.classList.add('hidden');
}

function hideMessages() {
resultDiv.classList.add('hidden');
errorDiv.classList.add('hidden');
}

/**
* Валидирует ввод чисел
* @param {HTMLInputElement} input - поле ввода
* @param {number} min - минимальное допустимое значение
* @param {number} max - максимальное допустимое значение
* @returns {boolean} - true если валидно
*/
function validateNumberInput(input, min = 1, max = 1000000) {
const value = parseInt(input.value);

if (isNaN(value)) {
input.style.borderColor = '#dc3545';
return false;
}

if (value < min || value > max) {
input.style.borderColor = '#ffc107';
return false;
}

input.style.borderColor = '#007bff';
return true;
}

/**
* Очищает все поля ввода в указанном контейнере
* @param {HTMLElement} container - контейнер с полями ввода
*/
function clearInputs(container) {
const inputs = container.querySelectorAll('input, textarea');
inputs.forEach(input => {
input.value = '';
input.style.borderColor = ''; // Сброс цвета границы
});
}

/**
* Добавляет обработчики событий для улучшения UX
*/
function setupUXEnhancements() {
// Автофокус на первом поле ввода активного режима
document.addEventListener('click', (e) => {
const activePanel = document.querySelector('.mode-panel.active');
if (activePanel) {
const firstInput = activePanel.querySelector('input, textarea');
if (firstInput) {
setTimeout(() => firstInput.focus(), 100);
}
}
});

// Обработка клавиши Enter в полях ввода
document.addEventListener('keydown', (e) => {
if (e.key === 'Enter') {
const activePanel = document.querySelector('.mode-panel.active');
if (activePanel) {
const generateBtn = activePanel.querySelector('[id*="generate"], [id*="list"]');
if (generateBtn) {
generateBtn.click();
}
}
}
});

// Очистка ошибок при вводе
document.addEventListener('input', (e) => {
if (e.target.matches('input, textarea')) {
e.target.style.borderColor = '';
hideMessages();
}
});
}

// Инициализация улучшений UX при загрузке
document.addEventListener('DOMContentLoaded', setupUXEnhancements);

// Обработка ошибок на уровне приложения
window.addEventListener('error', (e) => {
console.error('Критическая ошибка приложения:', e.error);
showError('Произошла непредвиденная ошибка. Попробуйте ещё раз.');
});

// Дополнительная инициализация при полной загрузке страницы
window.addEventListener('load', () => {
// Показываем сообщение о готовности
setTimeout(() => {
showResult('Генератор готов к работе! Выберите режим и начните использовать.', 'info-msg');
setTimeout(hideMessages, 3000);
}, 500);
});

/**
* Копирует текст в буфер обмена
* @param {string} text - текст для копирования
*/
function copyToClipboard(text) {
navigator.clipboard.writeText(text).then(() => {
showResult(`Скопировано в буфер: <strong>${text}</strong>`, 'success-msg');
setTimeout(hideMessages, 2000);
}).catch(err => {
console.error('Ошибка при копировании: ', err);
showError('Не удалось скопировать текст');
});
}

// Функция для копирования результата в буфер обмена
function setupCopyFunctionality() {
const copyBtn = document.getElementById('copyBtn');
if (copyBtn) {
copyBtn.addEventListener('click', () => {
if (!resultDiv.classList.contains('hidden') && resultDiv.textContent) {
// Убираем HTML‑теги перед копированием
const cleanText = resultDiv.innerHTML.replace(/<[^>]*>/g, '').trim();
copyToClipboard(cleanText);
} else {
showError('Нет данных для копирования');
}
});
}
}

// Инициализация копирования
document.addEventListener('DOMContentLoaded', setupCopyFunctionality);

/**
* Задержка выполнения (для анимаций и т. д.)
* @param {number} ms - миллисекунды задержки
* @returns {Promise}
*/
function delay(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

/**
* Безопасное обновление DOM с проверкой существования элемента
* @param {string} selector - CSS‑селектор элемента
* @param {function} callback - функция для выполнения с элементом
*/
function safeDOMUpdate(selector, callback) {
const element = document.querySelector(selector);
if (element) {
callback(element);
} else {
console.warn(`Элемент ${selector} не найден`);
}
}

// Функция инициализации всех обработчиков
function initializeApp() {
try {
setupModeSwitching();
setupNumberMode();
setupCustomListMode();
setupLuckyTicketMode();
setupUXEnhancements();
setupCopyFunctionality();

// Инициализация превью списка при загрузке (если есть сохранённые данные)
const itemsTextarea = document.getElementById('userList');
if (itemsTextarea && itemsTextarea.value) {
updateListPreview(itemsTextarea.value.trim().split(',').map(item => item.trim()).filter(item => item !== ''));
}

console.log('Приложение успешно инициализировано');
} catch (error) {
console.error('Ошибка инициализации приложения:', error);
showError('Ошибка инициализации. Перезагрузите страницу.');
}
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', initializeApp);

/**
* Сброс всех режимов и полей ввода
*/
function resetAllModes() {
hideMessages();
clearInputs(document.querySelector('.mode-panel.active'));

// Сброс счастливого билета
if (ticketNumber) {
ticketNumber.textContent = '000000';
}
if (ticketStatus) {
ticketStatus.textContent = 'Обычный билет';
ticketStatus.className = 'normal';
}

// Сброс превью списка
updateListPreview([]);
}

// Добавляем глобальную кнопку сброса (если есть)
document.addEventListener('DOMContentLoaded', () => {
const globalResetBtn = document.getElementById('globalReset');
if (globalResetBtn ) {
globalResetBtn.addEventListener('click', resetAllModes);
}
});

// Экспорт функций для возможного использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
module.exports = {
generateTicketNumber,
checkLuckyTicket,
showResult,
showError,
hideMessages,
copyToClipboard,
validateNumberInput,
clearInputs,
setupUXEnhancements,
setupCopyFunctionality,
delay,
safeDOMUpdate,
initializeApp,
resetAllModes,
updateListPreview,
getPresetDisplayName,
setupPresets
};
}

/**
* Функция диагностики для отладки пресетов
* Помогает выявить проблемы с пресетами на этапе разработки
*/
function debugPresets() {
console.log('=== ДИАГНОСТИКА ПРЕСЕТОВ ===');
console.log('Доступные пресеты:', Object.keys(listPresets));

const presetButtons = document.querySelectorAll('.preset-btn[data-preset]');
console.log(`Найдено кнопок пресетов: ${presetButtons.length}`);

presetButtons.forEach((btn, index) => {
const presetName = btn.getAttribute('data-preset');
console.log(
`Кнопка ${index + 1}: data-preset="${presetName}", ` +
`существует в listPresets: ${!!listPresets[presetName]}`
);
});

// Проверка текстового поля для списка
const itemsTextarea = document.getElementById('userList');
console.log('Текстовое поле userList найдено:', !!itemsTextarea);

console.log('=========================');
}

// Вызов диагностики при загрузке (можно закомментировать в продакшене)
document.addEventListener('DOMContentLoaded', () => {
setTimeout(debugPresets, 100);
});

/**
* Инициализирует все обработчики событий для приложения
* Централизованная функция для удобства отладки
*/
function initEventHandlers() {
setupModeSwitching();
setupNumberMode();
setupCustomListMode();
setupLuckyTicketMode();
setupUXEnhancements();
setupCopyFunctionality();
}

/**
* Полная инициализация приложения с обработкой ошибок
*/
function fullAppInit() {
try {
// Инициализация обработчиков событий
initEventHandlers();

// Установка значений по умолчанию
const minNum = document.getElementById('minNum');
const maxNum = document.getElementById('maxNum');
if (minNum) minNum.value = '1';
if (maxNum) maxNum.value = '100';

// Инициализация превью списка, если есть сохранённые данные
const itemsTextarea = document.getElementById('userList');
if (itemsTextarea && itemsTextarea.value) {
const items = itemsTextarea.value.trim().split(',').map(item => item.trim()).filter(item => item !== '');
updateListPreview(items);
}

console.log('✅ Приложение полностью инициализировано');

// Показываем приветственное сообщение
setTimeout(() => {
showResult('Генератор готов к работе! Выберите режим и начните использовать.', 'info-msg');
setTimeout(hideMessages, 3000);
}, 500);

} catch (error) {
console.error('❌ Ошибка инициализации приложения:', error);
showError('Ошибка инициализации. Перезагрузите страницу.');
}
}

/**
* Безопасная инициализация с проверкой готовности DOM
*/
function safeInit() {
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', fullAppInit);
} else {
fullAppInit();
}
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', safeInit);

/**
* Обработчик для глобального сброса всех режимов
* Может быть вызван из любого места приложения
*/
window.resetApplication = function() {
resetAllModes();
hideMessages();

// Сброс всех полей ввода во всех режимах
modePanels.forEach(panel => {
clearInputs(panel);
});

showResult('Все режимы сброшены к исходному состоянию.', 'info-msg');
setTimeout(hideMessages, 2000);
};

/**
* Функция для программной загрузки пресета
* Может использоваться для тестирования или интеграции
* @param {string} presetKey - ключ пресета (например, 'yesno', 'numbers')
*/
window.loadPreset = function(presetKey) {
const itemsTextarea = document.getElementById('userList');
if (!itemsTextarea) {
console.error('Текстовое поле для списка не найдено');
return;
}

if (!listPresets[presetKey]) {
console.error(`Пресет "${presetKey}" не существует`);
showError(`Пресет "${presetKey}" недоступен`);
return;
}

itemsTextarea.value = listPresets[presetKey].join(', ');
updateListPreview(listPresets[presetKey]);
showResult(`Загружен пресет: <strong>${getPresetDisplayName(presetKey)}</strong>`, 'info-msg');
setTimeout(hideMessages, 2000);
};

window.addEventListener('unhandledrejection', event => {
console.error('Необработанное обещание отклонено:', event.reason);
showError('Произошла ошибка в работе приложения. Попробуйте ещё раз.');
});

console.log('📦 Генератор случайных значений загружен и готов к работе!');