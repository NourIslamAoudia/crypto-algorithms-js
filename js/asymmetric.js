document.addEventListener('DOMContentLoaded', function() {
    initializeRSA();
    initializeElGamal();
});

/*----------------------RSA----------------------*/
function initializeRSA() {
    const rsaGenerateBtn = document.getElementById('rsa-generate');
    const rsaEncryptBtn = document.getElementById('rsa-encrypt');
    const rsaDecryptBtn = document.getElementById('rsa-decrypt');
    const rsaCopyBtn = document.getElementById('rsa-copy');
    const rsaClearBtn = document.getElementById('rsa-clear');

    if (rsaGenerateBtn) rsaGenerateBtn.addEventListener('click', generateSimplifiedRSAKeys);
    if (rsaEncryptBtn)  rsaEncryptBtn.addEventListener('click', () => handleRSA('encrypt'));
    if (rsaDecryptBtn)  rsaDecryptBtn.addEventListener('click', () => handleRSA('decrypt'));
    if (rsaCopyBtn)     rsaCopyBtn.addEventListener('click', () => copyToClipboardMulti(['rsa-public-key','rsa-private-key'], rsaCopyBtn));
    if (rsaClearBtn)    rsaClearBtn.addEventListener('click', () => clearFields('rsa-public-key','rsa-private-key','rsa-plaintext','rsa-result'));
}

// Génération simplifiée de clés RSA (entiers fictifs)
function generateSimplifiedRSAKeys() {
    const prime1 = randomInt(100, 300);
    const prime2 = randomInt(300, 500);
    const n = prime1 * prime2;
    const e = randomInt(2, 50);
    const d = randomInt(50, 200);

    document.getElementById('rsa-public-key').value = `(${e}, ${n})`;
    document.getElementById('rsa-private-key').value = `(${d}, ${n})`;
    showAlert("Clés RSA (fictives) générées", "info");
}

function handleRSA(action) {
    const plaintext = document.getElementById('rsa-plaintext').value;
    const resultTextarea = document.getElementById('rsa-result');
    if (!plaintext) {
        showAlert("Veuillez saisir un texte à traiter (RSA)", "error");
        return;
    }
    if (action === 'encrypt') {
        resultTextarea.value = btoa(plaintext);
        resultTextarea.style.color = "#ccd6f6";
        showAlert("Texte chiffré (RSA) [fictif]", "success");
    } else {
        try {
            resultTextarea.value = atob(plaintext);
            resultTextarea.style.color = "red";
            showAlert("Texte déchiffré (RSA) [fictif]", "success");
        } catch {
            showAlert("Erreur de déchiffrement (RSA)", "error");
        }
    }
}


/* ---------------------- ElGamal ---------------------- */

function initializeElGamal() {
    const elgamalGenerateBtn = document.getElementById('elgamal-generate');
    const elgamalEncryptBtn = document.getElementById('elgamal-encrypt');
    const elgamalDecryptBtn = document.getElementById('elgamal-decrypt');
    const elgamalCopyBtn = document.getElementById('elgamal-copy');
    const elgamalClearBtn = document.getElementById('elgamal-clear');

    if (elgamalGenerateBtn) {
        console.log("Bouton Générer Clés trouvé");
        elgamalGenerateBtn.addEventListener('click', generateElGamalKeys);
    }
    if (elgamalEncryptBtn) {
        console.log("Bouton Chiffrer trouvé");
        elgamalEncryptBtn.addEventListener('click', () => handleElGamal('encrypt'));
    }
    if (elgamalDecryptBtn) {
        console.log("Bouton Déchiffrer trouvé");
        elgamalDecryptBtn.addEventListener('click', () => handleElGamal('decrypt'));
    }
    if (elgamalCopyBtn) {
        console.log("Bouton Copier trouvé");
        elgamalCopyBtn.addEventListener('click', () => copyToClipboardMulti(['elgamal-public-key', 'elgamal-private-key'], elgamalCopyBtn));
    }
    if (elgamalClearBtn) {
        console.log("Bouton Effacer trouvé");
        elgamalClearBtn.addEventListener('click', () => clearFields('elgamal-public-key', 'elgamal-private-key', 'elgamal-plaintext', 'elgamal-result'));
    }
}

// Génération simplifiée de clés ElGamal (entiers fictifs)
function generateSimplifiedElGamalKeys() {
    const p = randomInt(200, 300);
    const g = randomInt(2, 50);
    const s = randomInt(50, 150);
    const y = (g ** s) % p;
    document.getElementById('elgamal-public-key').value = `(${p}, ${g}, ${y})`;
    document.getElementById('elgamal-private-key').value = `(${s})`;
    showAlert("Clés ElGamal (fictives) générées", "info");
}

// Gestion du chiffrement et déchiffrement ElGamal
// Utilitaires mathématiques pour ElGamal
class ElGamalCrypto {
    // Test de primalité de Miller-Rabin
    static isPrime(n, k = 5) {
        if (n < 2) return false;
        if (n === 2 || n === 3) return true;
        if (n % 2 === 0) return false;

        // Écrire n-1 comme d * 2^r
        let r = 0;
        let d = n - 1;
        while (d % 2 === 0) {
            d /= 2;
            r++;
        }

        // Test de Miller-Rabin k fois
        for (let i = 0; i < k; i++) {
            const a = Math.floor(Math.random() * (n - 4)) + 2;
            let x = this.modPow(a, d, n);
            
            if (x === 1 || x === n - 1) continue;
            
            let composite = true;
            for (let j = 0; j < r - 1; j++) {
                x = this.modPow(x, 2, n);
                if (x === n - 1) {
                    composite = false;
                    break;
                }
            }
            if (composite) return false;
        }
        return true;
    }

    // Génération d'un nombre premier dans une plage
    static generatePrime(min, max) {
        let candidate;
        do {
            candidate = Math.floor(Math.random() * (max - min + 1)) + min;
            // S'assurer que c'est impair
            if (candidate % 2 === 0) candidate++;
        } while (!this.isPrime(candidate));
        return candidate;
    }

    // Exponentiation modulaire rapide
    static modPow(base, exponent, modulus) {
        if (modulus === 1) return 0;
        let result = 1;
        base = base % modulus;
        while (exponent > 0) {
            if (exponent % 2 === 1) {
                result = (result * base) % modulus;
            }
            exponent = Math.floor(exponent / 2);
            base = (base * base) % modulus;
        }
        return result;
    }

    // Algorithme d'Euclide étendu
    static extendedGCD(a, b) {
        if (a === 0) return [b, 0, 1];
        const [gcd, x1, y1] = this.extendedGCD(b % a, a);
        const x = y1 - Math.floor(b / a) * x1;
        const y = x1;
        return [gcd, x, y];
    }

    // Inverse modulaire
    static modInverse(a, m) {
        const [gcd, x] = this.extendedGCD(a, m);
        if (gcd !== 1) return null; // Pas d'inverse
        return (x % m + m) % m;
    }

    // Trouve un générateur primitif modulo p
    static findGenerator(p) {
        const phi = p - 1;
        const factors = this.primeFactors(phi);
        
        for (let g = 2; g < p; g++) {
            let isPrimitive = true;
            for (const factor of factors) {
                if (this.modPow(g, phi / factor, p) === 1) {
                    isPrimitive = false;
                    break;
                }
            }
            if (isPrimitive) return g;
        }
        return 2; // Fallback
    }

    // Factorisation simple pour petits nombres
    static primeFactors(n) {
        const factors = [];
        for (let i = 2; i * i <= n; i++) {
            while (n % i === 0) {
                factors.push(i);
                n /= i;
            }
        }
        if (n > 1) factors.push(n);
        return [...new Set(factors)]; // Facteurs uniques
    }

    // Conversion texte vers nombres
    static textToNumbers(text) {
        return Array.from(text).map(char => char.charCodeAt(0));
    }

    // Conversion nombres vers texte
    static numbersToText(numbers) {
        return numbers.map(num => String.fromCharCode(num)).join('');
    }
}

// Variables globales pour les clés
let elgamalKeys = null;

function initializeElGamal() {
    const elgamalGenerateBtn = document.getElementById('elgamal-generate');
    const elgamalEncryptBtn = document.getElementById('elgamal-encrypt');
    const elgamalDecryptBtn = document.getElementById('elgamal-decrypt');
    const elgamalCopyBtn = document.getElementById('elgamal-copy');
    const elgamalClearBtn = document.getElementById('elgamal-clear');

    if (elgamalGenerateBtn) elgamalGenerateBtn.addEventListener('click', generateElGamalKeys);
    if (elgamalEncryptBtn) elgamalEncryptBtn.addEventListener('click', () => handleElGamal('encrypt'));
    if (elgamalDecryptBtn) elgamalDecryptBtn.addEventListener('click', () => handleElGamal('decrypt'));
    if (elgamalCopyBtn) elgamalCopyBtn.addEventListener('click', () => copyToClipboardMulti(['elgamal-public-key', 'elgamal-private-key'], elgamalCopyBtn));
    if (elgamalClearBtn) elgamalClearBtn.addEventListener('click', () => clearFields('elgamal-public-key', 'elgamal-private-key', 'elgamal-plaintext', 'elgamal-result'));
}

// Génération des clés ElGamal
function generateElGamalKeys() {
    try {
        // Générer un nombre premier p (relativement petit pour les calculs JS)
        const p = ElGamalCrypto.generatePrime(1000, 2000);
        
        // Trouver un générateur g
        const g = ElGamalCrypto.findGenerator(p);
        
        // Clé privée aléatoire
        const x = Math.floor(Math.random() * (p - 2)) + 1;
        
        // Clé publique y = g^x mod p
        const y = ElGamalCrypto.modPow(g, x, p);
        
        // Stocker les clés
        elgamalKeys = {
            p: p,
            g: g,
            y: y,
            x: x
        };
        
        // Afficher les clés
        document.getElementById('elgamal-public-key').value = `p=${p}, g=${g}, y=${y}`;
        document.getElementById('elgamal-private-key').value = `x=${x}`;
        
        showAlert("Clés ElGamal générées avec succès", "success");
    } catch (error) {
        showAlert("Erreur lors de la génération des clés: " + error.message, "error");
    }
}

// Chiffrement ElGamal
function encryptElGamal(message, keys) {
    const { p, g, y } = keys;
    const messageNumbers = ElGamalCrypto.textToNumbers(message);
    const ciphertext = [];
    
    for (const m of messageNumbers) {
        // Vérifier que le message est dans la plage valide
        if (m >= p) {
            throw new Error(`Caractère '${String.fromCharCode(m)}' trop grand pour p=${p}`);
        }
        
        // Générer k aléatoire pour chaque caractère
        const k = Math.floor(Math.random() * (p - 2)) + 1;
        
        // Calculer c1 = g^k mod p
        const c1 = ElGamalCrypto.modPow(g, k, p);
        
        // Calculer c2 = m * y^k mod p
        const c2 = (m * ElGamalCrypto.modPow(y, k, p)) % p;
        
        ciphertext.push([c1, c2]);
    }
    
    return ciphertext;
}

// Déchiffrement ElGamal
function decryptElGamal(ciphertext, keys) {
    const { p, x } = keys;
    const decryptedNumbers = [];
    
    for (const [c1, c2] of ciphertext) {
        // Calculer s = c1^x mod p
        const s = ElGamalCrypto.modPow(c1, x, p);
        
        // Calculer l'inverse de s
        const sInv = ElGamalCrypto.modInverse(s, p);
        
        if (sInv === null) {
            throw new Error("Impossible de calculer l'inverse modulaire");
        }
        
        // Récupérer le message m = c2 * s^(-1) mod p
        const m = (c2 * sInv) % p;
        
        decryptedNumbers.push(m);
    }
    
    return ElGamalCrypto.numbersToText(decryptedNumbers);
}

// Gestion du chiffrement et déchiffrement ElGamal
function handleElGamal(action) {
    const plaintext = document.getElementById('elgamal-plaintext').value;
    const resultTextarea = document.getElementById('elgamal-result');
    
    if (!plaintext) {
        showAlert("Veuillez saisir un texte à traiter", "error");
        return;
    }
    
    if (!elgamalKeys) {
        showAlert("Veuillez générer les clés ElGamal avant de continuer", "error");
        return;
    }
    
    try {
        if (action === 'encrypt') {
            const ciphertext = encryptElGamal(plaintext, elgamalKeys);
            // Convertir en format lisible
            const ciphertextStr = ciphertext.map(([c1, c2]) => `(${c1},${c2})`).join(',');
            resultTextarea.value = ciphertextStr;
            resultTextarea.style.color = "#ccd6f6";
            showAlert("Texte chiffré avec ElGamal", "success");
        } else if (action === 'decrypt') {
            // Parser le texte chiffré
            const pairs = plaintext.match(/\((\d+),(\d+)\)/g);
            if (!pairs) {
                throw new Error("Format de texte chiffré invalide. Utilisez le format: (c1,c2),(c1,c2),...");
            }
            
            const ciphertext = pairs.map(pair => {
                const match = pair.match(/\((\d+),(\d+)\)/);
                return [parseInt(match[1]), parseInt(match[2])];
            });
            
            const decrypted = decryptElGamal(ciphertext, elgamalKeys);
            resultTextarea.value = decrypted;
            resultTextarea.style.color = "red";
            showAlert("Texte déchiffré avec ElGamal", "success");
        }
    } catch (error) {
        showAlert("Erreur ElGamal: " + error.message, "error");
    }
}

// Fonctions utilitaires (à implémenter selon votre interface)
function showAlert(message, type) {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Implémentez votre système d'alertes ici
}

function copyToClipboardMulti(elementIds, button) {
    const texts = elementIds.map(id => {
        const element = document.getElementById(id);
        return element ? element.value : '';
    }).filter(text => text);
    
    const combinedText = texts.join('\n');
    navigator.clipboard.writeText(combinedText).then(() => {
        showAlert("Clés copiées dans le presse-papiers", "success");
    });
}

function clearFields(...elementIds) {
    elementIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    elgamalKeys = null;
    showAlert("Champs effacés", "info");
}
/* ---------------------- Fonctions utilitaires ---------------------- */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function arrayBufferToBase64(buffer) {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
}
function copyToClipboardMulti(ids, buttonElement) {
    let combinedText = "";
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value) combinedText += el.value + "\n";
    });
    if (combinedText.trim()) {
        navigator.clipboard.writeText(combinedText)
            .then(() => showCopyFeedback(buttonElement))
            .catch(err => showAlert("Erreur de copie: " + err, "error"));
    }
}
function clearFields(...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });
}
