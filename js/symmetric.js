/**
 * Implémentation d’exemples de chiffrement symétrique (AES, DES, ChaCha20, Blowfish).
 * Note: certaines fonctions reposent sur le Web Crypto API ou des placeholders
 *       pour la démonstration. Les vraies implémentations peuvent nécessiter
 *       des bibliothèques tierces.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialisation des ciphers
    initializeAESCipher();
    initializeDESCipher();
    initializeChaCha20Cipher();
    initializeBlowfishCipher();
});

/* ---------------------- AES ---------------------- */
function initializeAESCipher() {
    const encryptBtn = document.getElementById('aes-encrypt');
    const decryptBtn = document.getElementById('aes-decrypt');
    const copyBtn    = document.getElementById('aes-copy');
    const clearBtn   = document.getElementById('aes-clear');

    if (encryptBtn) {
        encryptBtn.addEventListener('click', function() {
            handleAESCipher('encrypt');
        });
    }
    if (decryptBtn) {
        decryptBtn.addEventListener('click', function() {
            handleAESCipher('decrypt');
        });
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyToClipboard('aes-result', this);
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearFields('aes-text', 'aes-result');
        });
    }
}

async function handleAESCipher(action) {
    const text = document.getElementById('aes-text').value;
    const key = document.getElementById('aes-key').value;
    const resultTextarea = document.getElementById('aes-result');

    if (!text) {
        showAlert('Veuillez saisir du texte à traiter', 'error');
        return;
    }
    if (!key) {
        showAlert('Veuillez saisir une clé', 'error');
        return;
    }

    try {
        if (action === 'encrypt') {
            const encrypted = await aesEncrypt(text, key);
            resultTextarea.value = btoa(String.fromCharCode(...new Uint8Array(encrypted)));
            resultTextarea.style.color = '#ccd6f6';
            showAlert('Texte chiffré avec succès (AES)', 'success');
        } else {
            // On suppose que le texte est en base64
            const encryptedData = Uint8Array.from(atob(text), c => c.charCodeAt(0));
            const decrypted = await aesDecrypt(encryptedData, key);
            resultTextarea.value = decrypted;
            resultTextarea.style.color = 'red';
            showAlert('Texte déchiffré avec succès (AES)', 'success');
        }
    } catch (err) {
        showAlert('Erreur : ' + err.message, 'error');
    }
}

/**
 * Chiffre le texte (UTF-8) avec AES-GCM via le Web Crypto API
 */
async function aesEncrypt(plaintext, passphrase) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw', 
        enc.encode(passphrase), 
        { name: 'PBKDF2' }, 
        false, 
        ['deriveKey']
    );
    // On utilise PBKDF2 pour dériver la clé
    const salt = enc.encode('static_salt'); // à adapter en prod
    const derivedKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 1000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
    // IV statique pour exemple, à modifier
    const iv = new Uint8Array(12);
    return crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        derivedKey,
        enc.encode(plaintext)
    );
}

/**
 * Déchiffre le texte (Uint8Array) avec AES-GCM via le Web Crypto API
 */
async function aesDecrypt(ciphertext, passphrase) {
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(passphrase),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    const salt = enc.encode('static_salt'); // même sel qu'au chiffrement
    const derivedKey = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: salt,
            iterations: 1000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
    const iv = new Uint8Array(12);
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        derivedKey,
        ciphertext
    );
    return dec.decode(decrypted);
}

/* ---------------------- DES ---------------------- */
function initializeDESCipher() {
    const encryptBtn = document.getElementById('des-encrypt');
    const decryptBtn = document.getElementById('des-decrypt');
    const copyBtn    = document.getElementById('des-copy');
    const clearBtn   = document.getElementById('des-clear');

    if (encryptBtn) {
        encryptBtn.addEventListener('click', function() {
            handleDESCipher('encrypt');
        });
    }
    if (decryptBtn) {
        decryptBtn.addEventListener('click', function() {
            handleDESCipher('decrypt');
        });
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyToClipboard('des-result', this);
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearFields('des-text', 'des-result');
        });
    }
}

function handleDESCipher(action) {
    const text = document.getElementById('des-text').value;
    const key = document.getElementById('des-key').value;
    const resultTextarea = document.getElementById('des-result');

    if (!text) {
        showAlert('Veuillez saisir du texte à traiter', 'error');
        return;
    }
    if (!key || key.length < 1) {
        showAlert('Veuillez saisir une clé DES valide', 'error');
        return;
    }

    // Ici une implémentation de démonstration (non sécurisée)
    // Pour un vrai usage, il faut utiliser une librairie DES fiable.
    let result;
    if (action === 'encrypt') {
        result = btoa(`DES(${key})::${text}`);
        resultTextarea.style.color = '#ccd6f6';
        showAlert('Texte chiffré avec succès (DES)', 'success');
    } else {
        try {
            const decoded = atob(text);
            result = decoded.replace(`DES(${key})::`, '');
            resultTextarea.style.color = 'red';
            showAlert('Texte déchiffré avec succès (DES)', 'success');
        } catch (err) {
            showAlert('Erreur de déchiffrement DES', 'error');
            return;
        }
    }
    resultTextarea.value = result;
}

/* ---------------------- ChaCha20 ---------------------- */
function initializeChaCha20Cipher() {
    const encryptBtn = document.getElementById('chacha20-encrypt');
    const decryptBtn = document.getElementById('chacha20-decrypt');
    const copyBtn    = document.getElementById('chacha20-copy');
    const clearBtn   = document.getElementById('chacha20-clear');

    if (encryptBtn) {
        encryptBtn.addEventListener('click', function() {
            handleChaCha20Cipher('encrypt');
        });
    }
    if (decryptBtn) {
        decryptBtn.addEventListener('click', function() {
            handleChaCha20Cipher('decrypt');
        });
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyToClipboard('chacha20-result', this);
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearFields('chacha20-text', 'chacha20-result');
        });
    }
}

function handleChaCha20Cipher(action) {
    const text = document.getElementById('chacha20-text').value;
    const key = document.getElementById('chacha20-key').value;
    const resultTextarea = document.getElementById('chacha20-result');

    if (!text) {
        showAlert('Veuillez saisir du texte à traiter', 'error');
        return;
    }
    if (!key) {
        showAlert('Veuillez saisir une clé ChaCha20', 'error');
        return;
    }

    // Placeholder ChaCha20 (non sécurisé, juste pour la démonstration)
    let result;
    if (action === 'encrypt') {
        result = btoa(`CHACHA20(${key})::${text}`);
        resultTextarea.style.color = '#ccd6f6';
        showAlert('Texte chiffré avec succès (ChaCha20)', 'success');
    } else {
        try {
            const decoded = atob(text);
            result = decoded.replace(`CHACHA20(${key})::`, '');
            resultTextarea.style.color = 'red';
            showAlert('Texte déchiffré avec succès (ChaCha20)', 'success');
        } catch (err) {
            showAlert('Erreur de déchiffrement ChaCha20', 'error');
            return;
        }
    }
    resultTextarea.value = result;
}

/* ---------------------- Blowfish ---------------------- */
function initializeBlowfishCipher() {
    const encryptBtn = document.getElementById('blowfish-encrypt');
    const decryptBtn = document.getElementById('blowfish-decrypt');
    const copyBtn    = document.getElementById('blowfish-copy');
    const clearBtn   = document.getElementById('blowfish-clear');

    if (encryptBtn) {
        encryptBtn.addEventListener('click', function() {
            handleBlowfishCipher('encrypt');
        });
    }
    if (decryptBtn) {
        decryptBtn.addEventListener('click', function() {
            handleBlowfishCipher('decrypt');
        });
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            copyToClipboard('blowfish-result', this);
        });
    }
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            clearFields('blowfish-text', 'blowfish-result');
        });
    }
}

function handleBlowfishCipher(action) {
    const text = document.getElementById('blowfish-text').value;
    const key = document.getElementById('blowfish-key').value;
    const resultTextarea = document.getElementById('blowfish-result');

    if (!text) {
        showAlert('Veuillez saisir du texte à traiter', 'error');
        return;
    }
    if (!key) {
        showAlert('Veuillez saisir une clé Blowfish', 'error');
        return;
    }

    // Placeholder Blowfish (non sécurisé)
    let result;
    if (action === 'encrypt') {
        result = btoa(`BLOWFISH(${key})::${text}`);
        resultTextarea.style.color = '#ccd6f6';
        showAlert('Texte chiffré avec succès (Blowfish)', 'success');
    } else {
        try {
            const decoded = atob(text);
            result = decoded.replace(`BLOWFISH(${key})::`, '');
            resultTextarea.style.color = 'red';
            showAlert('Texte déchiffré avec succès (Blowfish)', 'success');
        } catch (err) {
            showAlert('Erreur de déchiffrement Blowfish', 'error');
            return;
        }
    }
    resultTextarea.value = result;
}

/* ---------------------- Fonctions utilitaires ---------------------- */

/**
 * Affiche une alerte (utilise showAlert du fichier main.js si présent)
 */
function showAlert(message, type) {
    if (typeof window.showAlert === 'function') {
        window.showAlert(message, type);
    } else {
        alert(`[${type}] ${message}`);
    }
}

/**
 * Copie dans le presse-papiers
 */
function copyToClipboard(resultId, buttonElement) {
    const resultTextarea = document.getElementById(resultId);
    if (resultTextarea && resultTextarea.value) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(resultTextarea.value)
                .then(() => showCopyFeedback(buttonElement))
                .catch(err => showAlert('Échec de la copie : ' + err, 'error'));
        } else {
            resultTextarea.select();
            document.execCommand('copy');
            showCopyFeedback(buttonElement);
        }
    }
}

/**
 * Met à jour le texte du bouton après la copie
 */
function showCopyFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copié !';
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
}

/**
 * Efface le champ texte et le champ résultat
 */
function clearFields(textId, resultId) {
    const textField = document.getElementById(textId);
    const resultField = document.getElementById(resultId);
    if (textField) textField.value = '';
    if (resultField) resultField.value = '';
    showAlert('Champs effacés', 'info');
}