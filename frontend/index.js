import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const languageSelect = document.getElementById('languageSelect');
const translationOutput = document.getElementById('translationOutput');
const speakButton = document.getElementById('speakButton');
const translationHistory = document.getElementById('translationHistory');

let currentTranslation = '';

// Initialize Google Translate API
function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

async function translateText() {
    const text = inputText.value;
    const targetLang = languageSelect.value;

    if (text.trim() === '') {
        translationOutput.textContent = '';
        return;
    }

    try {
        // Use Google Translate API
        const translation = await new Promise((resolve, reject) => {
            google.language.translate(text, 'en', targetLang, (result) => {
                if (result.error) {
                    reject(result.error);
                } else {
                    resolve(result.translation);
                }
            });
        });

        currentTranslation = translation;
        translationOutput.textContent = currentTranslation;

        // Store translation in the backend
        await backend.addTranslation(text, currentTranslation, targetLang);
        updateTranslationHistory();
    } catch (error) {
        console.error('Translation error:', error);
        translationOutput.textContent = 'Translation error. Please try again.';
    }
}

function speakTranslation() {
    if (currentTranslation) {
        const utterance = new SpeechSynthesisUtterance(currentTranslation);
        utterance.lang = languageSelect.value;
        speechSynthesis.speak(utterance);
    }
}

async function updateTranslationHistory() {
    const history = await backend.getTranslations();
    translationHistory.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.original} -> ${item.translated} (${item.language})`;
        translationHistory.appendChild(li);
    });
}

inputText.addEventListener('input', translateText);
languageSelect.addEventListener('change', translateText);
speakButton.addEventListener('click', speakTranslation);

// Initial update of translation history
updateTranslationHistory();

// Make sure to call googleTranslateElementInit after the page loads
window.googleTranslateElementInit = googleTranslateElementInit;
