/**
 * Cryptography functions for Caesar and Vigenère ciphers
 * 
 * This script handles initialization and implementation of classical ciphers:
 * - Caesar cipher (simple shift cipher)
 * - Vigenère cipher (polyalphabetic substitution)
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Caesar cipher buttons
    initializeCaesarCipher();
    
    // Initialize Vigenère cipher buttons
    initializeVigenereCipher();

    // Initialize Atbash cipher buttons
    initializeAtbashCipher();
    // Initialize Substitution cipher buttons
    initializeSubstitutionCipher()

    // Initialize ROT13 cipher buttons
    initializeRot13Cipher();
});

/**
 * Initializes the Caesar cipher functionality
 */
function initializeCaesarCipher() {
    const caesarEncryptBtn = document.getElementById('caesar-encrypt');
    const caesarDecryptBtn = document.getElementById('caesar-decrypt');
        
    if (caesarEncryptBtn && caesarDecryptBtn) {
        caesarEncryptBtn.addEventListener('click', handleCaesarCipher.bind(null, 'encrypt'));
        caesarDecryptBtn.addEventListener('click', handleCaesarCipher.bind(null, 'decrypt'));

    }
}

/**
 * Initializes the Vigenère cipher functionality
 */
function initializeVigenereCipher() {
    const vigenereEncryptBtn = document.getElementById('vigenere-encrypt');
    const vigenereDecryptBtn = document.getElementById('vigenere-decrypt');
        
    if (vigenereEncryptBtn && vigenereDecryptBtn) {
        vigenereEncryptBtn.addEventListener('click', handleVigenereCipher.bind(null, 'encrypt'));
        vigenereDecryptBtn.addEventListener('click', handleVigenereCipher.bind(null, 'decrypt'));
    }
}

/**
 * Handles the Caesar cipher encryption/decryption process
 * @param {string} action - 'encrypt' or 'decrypt'
 */
function handleCaesarCipher(action) {
    const text = document.getElementById('caesar-text').value;
    const shiftInput = document.getElementById('caesar-shift').value;
    const shift = parseInt(shiftInput) || 3; // Default to 3 if invalid
    const resultTextarea = document.getElementById('caesar-result');
        
    if (!text) {
        showAlert('Veuillez entrer un texte à traiter', 'error');
        return;
    }
        
    const result = caesarCipher(text, shift, action);
    resultTextarea.value = result;
    resultTextarea.style.color = action === 'encrypt' ? '#ccd6f6' : 'red';
    showAlert(`Texte ${action === 'encrypt' ? 'chiffré' : 'déchiffré'} avec succès`, 'success');
}

/**
 * Implements the Caesar cipher algorithm
 * @param {string} text - Text to encrypt/decrypt
 * @param {number} shift - Number of positions to shift each character
 * @param {string} action - 'encrypt' or 'decrypt'
 * @returns {string} - The processed text
 */
function caesarCipher(text, shift, action) {
    // Adjust shift direction based on action
    shift = action === 'decrypt' ? -shift : shift;
    
    // Ensure shift is within alphabet range (modulo 26)
    shift = ((shift % 26) + 26) % 26;
        
    return text.replace(/[a-zA-Z]/g, function(char) {
        const code = char.charCodeAt(0);
        // Determine if uppercase or lowercase
        const base = code <= 90 ? 65 : 97;
        
        // Apply shift with proper wrapping
        return String.fromCharCode(((code - base + shift) % 26) + base);
    });
}



/**
 * Handles the Vigenère cipher encryption/decryption process
 * @param {string} action - 'encrypt' or 'decrypt'
 */
function handleVigenereCipher(action) {
    const text = document.getElementById('vigenere-text').value;
    const key = document.getElementById('vigenere-key').value;
    const resultTextarea = document.getElementById('vigenere-result');
        
    if (!text) {
        showAlert('Veuillez entrer un texte à traiter', 'error');
        return;
    }
        
    if (!key) {
        showAlert('Veuillez entrer une clé', 'error');
        return;
    }
        
    const result = vigenereCipher(text, key, action);
    resultTextarea.value = result;
    resultTextarea.style.color = action === 'encrypt' ? '#ccd6f6' : 'red';
    showAlert(`Texte ${action === 'encrypt' ? 'chiffré' : 'déchiffré'} avec succès`, 'success');
}

/**
 * Implements the Vigenère cipher algorithm
 * @param {string} text - Text to encrypt/decrypt
 * @param {string} key - Encryption/decryption key
 * @param {string} action - 'encrypt' or 'decrypt'
 * @returns {string} - The processed text
 */
function vigenereCipher(text, key, action) {
    // Clean and normalize the key (only uppercase letters)
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    
    if (!key.length) {
        showAlert('Clé invalide, veuillez n\'utiliser que des lettres', 'error');
        return text;
    }
        
    let keyIndex = 0;
    const keyLength = key.length;
        
    return text.replace(/[a-zA-Z]/g, function(char) {
        const code = char.charCodeAt(0);
        // Determine if uppercase or lowercase
        const base = code <= 90 ? 65 : 97;
        
        // Get the shift amount from the current key character (A=0, B=1, etc.)
        const keyChar = key[keyIndex % keyLength].charCodeAt(0) - 65;
        // Adjust shift direction based on action
        const shift = action === 'decrypt' ? -keyChar : keyChar;
                
        keyIndex++;
        // Apply shift with proper wrapping
        return String.fromCharCode(((code - base + shift + 26) % 26) + base);
    });
}

/**
 * Preserves spacing and non-alphabetic characters in cipher processing
 * @param {string} text - Original text with all characters
 * @param {string} processedText - Processed text with only alphabetic characters
 * @returns {string} - Full text with preserved formatting
 */
function preserveFormatting(text, processedText) {
    let result = '';
    let processedIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/[a-zA-Z]/.test(char)) {
            result += processedText[processedIndex++];
        } else {
            result += char;
        }
    }
    
    return result;
}

/**
 * Initializes the Atbash cipher functionality
 */
function initializeAtbashCipher() {
    const atbashProcessBtn = document.getElementById('atbash-process');
    const atbashCopyBtn = document.getElementById('atbash-copy');
    const atbashClearBtn = document.getElementById('atbash-clear');
    
    if (atbashProcessBtn) {
        atbashProcessBtn.addEventListener('click', handleAtbashCipher);
    }
    
    if (atbashCopyBtn) {
        atbashCopyBtn.addEventListener('click', function() {
            const resultText = document.getElementById('atbash-result');
            if (resultText && resultText.value) {
                resultText.select();
                document.execCommand('copy');
                showAlert('Texte copié dans le presse-papiers', 'success');
            } else {
                showAlert('Aucun texte à copier', 'error');
            }
        });
    }
    
    if (atbashClearBtn) {
        atbashClearBtn.addEventListener('click', function() {
            document.getElementById('atbash-text').value = '';
            document.getElementById('atbash-result').value = '';
        });
    }
}

/**
 * Handles the Atbash cipher process (encryption/decryption)
 */
function handleAtbashCipher() {
    const text = document.getElementById('atbash-text').value;
    const resultTextarea = document.getElementById('atbash-result');
    
    if (!text) {
        showAlert('Veuillez entrer un texte à traiter', 'error');
        return;
    }
    
    const result = atbashCipher(text);
    resultTextarea.value = result;
    resultTextarea.style.color = '#ccd6f6';
    showAlert('Texte traité avec succès', 'success');
}

/**
 * Implements the Atbash cipher algorithm
 * @param {string} text - Text to process
 * @returns {string} - The processed text
 */
function atbashCipher(text) {
    return text.replace(/[a-zA-Z]/g, function(char) {
        const code = char.charCodeAt(0);
        // Determine if uppercase or lowercase
        const base = code <= 90 ? 65 : 97;
        
        // Apply the Atbash substitution: For each letter at position p,
        // replace with the letter at position (25-p)
        return String.fromCharCode(base + (25 - (code - base)));
    });
}

/**
 * Initializes the Substitution cipher functionality
 */
function initializeSubstitutionCipher() {
    const substitutionEncryptBtn = document.getElementById('substitution-encrypt');
    const substitutionDecryptBtn = document.getElementById('substitution-decrypt');
    const substitutionRandomBtn = document.getElementById('substitution-random');
    const substitutionCopyBtn = document.getElementById('substitution-copy');
    const substitutionClearBtn = document.getElementById('substitution-clear');

    if (substitutionEncryptBtn && substitutionDecryptBtn) {
        substitutionEncryptBtn.addEventListener('click', handleSubstitutionCipher.bind(null, 'encrypt'));
        substitutionDecryptBtn.addEventListener('click', handleSubstitutionCipher.bind(null, 'decrypt'));
    }

    if (substitutionRandomBtn) {
        substitutionRandomBtn.addEventListener('click', function() {
            const randomKey = generateRandomSubstitutionKey();
            document.getElementById('substitution-key').value = randomKey;
            showAlert('Clé de substitution aléatoire générée', 'success');
        });
    }

    if (substitutionCopyBtn) {
        substitutionCopyBtn.addEventListener('click', function() {
            const resultText = document.getElementById('substitution-result');
            if (resultText && resultText.value) {
                resultText.select();
                document.execCommand('copy');
                showAlert('Texte copié dans le presse-papiers', 'success');
            } else {
                showAlert('Aucun texte à copier', 'error');
            }
        });
    }

    if (substitutionClearBtn) {
        substitutionClearBtn.addEventListener('click', function() {
            document.getElementById('substitution-text').value = '';
            document.getElementById('substitution-key').value = '';
            document.getElementById('substitution-result').value = '';
        });
    }
}

/**
 * Handles the Substitution cipher process
 * @param {string} action - 'encrypt' or 'decrypt'
 */
function handleSubstitutionCipher(action) {
    const text = document.getElementById('substitution-text').value;
    const key = document.getElementById('substitution-key').value.toUpperCase();
    const resultTextarea = document.getElementById('substitution-result');

    if (!text) {
        showAlert('Veuillez entrer un texte à traiter', 'error');
        return;
    }

    if (!key || key.length !== 26) {
        showAlert('Veuillez entrer une clé de 26 lettres', 'error');
        return;
    }

    const result = substitutionCipher(text, key, action);
    resultTextarea.value = result;
    resultTextarea.style.color = action === 'encrypt' ? '#ccd6f6' : 'red';
    showAlert(`Texte ${action === 'encrypt' ? 'chiffré' : 'déchiffré'} avec succès`, 'success');
}

/**
 * Implements the Substitution cipher algorithm
 * @param {string} text - Text to encrypt/decrypt
 * @param {string} key - Substitution key (26 letters)
 * @param {string} action - 'encrypt' or 'decrypt'
 * @returns {string}
 */
function substitutionCipher(text, key, action) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const mapping = {};

    // Build mapping for encryption or decryption
    for (let i = 0; i < 26; i++) {
        const plainChar = alphabet[i];
        const cipherChar = key[i];
        if (action === 'encrypt') {
            mapping[plainChar] = cipherChar;
            mapping[plainChar.toLowerCase()] = cipherChar.toLowerCase();
        } else {
            mapping[cipherChar] = plainChar;
            mapping[cipherChar.toLowerCase()] = plainChar.toLowerCase();
        }
    }

    return text.split('').map(char => mapping[char] || char).join('');
}

/**
 * Generates a random 26-letter key
 * @returns {string}
 */
function generateRandomSubstitutionKey() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (let i = alphabet.length - 1; i > 0; i--) {
        const randIndex = Math.floor(Math.random() * (i + 1));
        [alphabet[i], alphabet[randIndex]] = [alphabet[randIndex], alphabet[i]];
    }
    return alphabet.join('');
}

/**
 * Initializes the ROT13 functionality
 */
function initializeRot13Cipher() {
    const rot13ProcessBtn = document.getElementById('rot13-process');
    const rot13CopyBtn = document.getElementById('rot13-copy');
    const rot13ClearBtn = document.getElementById('rot13-clear');
    
    if (rot13ProcessBtn) {
        rot13ProcessBtn.addEventListener('click', handleRot13Cipher);
    }
    
    if (rot13CopyBtn) {
        rot13CopyBtn.addEventListener('click', function() {
            const resultText = document.getElementById('rot13-result');
            if (resultText && resultText.value) {
                resultText.select();
                document.execCommand('copy');
                showAlert('Texte copié dans le presse-papiers', 'success');
            } else {
                showAlert('Aucun texte à copier', 'error');
            }
        });
    }
    
    if (rot13ClearBtn) {
        rot13ClearBtn.addEventListener('click', function() {
            document.getElementById('rot13-text').value = '';
            document.getElementById('rot13-result').value = '';
        });
    }
}

/**
 * Handles the ROT13 process
 */
function handleRot13Cipher() {
    const text = document.getElementById('rot13-text').value;
    const resultTextarea = document.getElementById('rot13-result');
    
    if (!text) {
        showAlert('Veuillez entrer un texte à traiter', 'error');
        return;
    }
    
    const result = rot13Cipher(text);
    resultTextarea.value = result;
    resultTextarea.style.color = '#ccd6f6';
    showAlert('Texte traité avec succès', 'success');
}

/**
 * Implements the ROT13 algorithm
 * @param {string} text
 * @returns {string}
 */
function rot13Cipher(text) {
    return text.replace(/[a-zA-Z]/g, function(char) {
        const code = char.charCodeAt(0);
        const base = code <= 90 ? 65 : 97;
        return String.fromCharCode(((code - base + 13) % 26) + base);
    });
}