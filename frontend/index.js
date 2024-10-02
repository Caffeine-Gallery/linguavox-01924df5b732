import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const languageSelect = document.getElementById('languageSelect');
const translationOutput = document.getElementById('translationOutput');
const speakButton = document.getElementById('speakButton');
const translationHistory = document.getElementById('translationHistory');

let currentTranslation = '';

async function translateText() {
    const text = inputText.value;
    const targetLang = languageSelect.value;

    if (text.trim() === '') {
        translationOutput.textContent = '';
        return;
    }

    try {
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: targetLang
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        currentTranslation = data.translatedText;
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
