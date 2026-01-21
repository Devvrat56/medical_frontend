// utils/translate.js
/**
 * Translates text to the target language using Google Translate's unofficial endpoint.
 * Includes timeout, better error handling, and strong fallback to original text.
 *
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language code (e.g. 'hi', 'es')
 * @param {string} [sourceLang='auto'] - Source language (optional)
 * @returns {Promise<string>} Translated text or original with note on failure
 */
export async function translateText(text, targetLang, sourceLang = 'auto') {
  // Skip translation in these cases
  if (!text?.trim()) return text;
  if (targetLang === 'en') return text; // No need to translate to English
  if (text.length < 3) return text; // Too short to bother

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 seconds max

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google Translate HTTP error: ${response.status}`);
    }

    const data = await response.json();

    // Google Translate response structure: [ [[translated, original, ...]], null, ... ]
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      throw new Error("Unexpected Google Translate response format");
    }

    // Join all translated segments
    const translatedParts = data[0]
      .map((segment) => segment[0])
      .filter(Boolean);

    const translated = translatedParts.join("");

    // Basic quality check
    if (translated.length < text.length * 0.4) {
      console.warn("Translation suspiciously short — using original");
      return `${text} (translation quality too low)`;
    }

    return translated;
  } catch (error) {
    console.warn("Translation failed:", error.message || error);
    
    // Strong fallback: return original with clear note
    const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(targetLang) || targetLang;
    return `${text}\n\n(Translation to ${langName} failed — showing original English)`;
  }
}