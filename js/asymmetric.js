
document.addEventListener('DOMContentLoaded', function() {
    initializeRSA();
    initializeDH();
    initializeECC();
    initializeElGamal();
});

/* ---------------------- RSA ---------------------- */
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

/* ---------------------- Diffie-Hellman (Placeholder) ---------------------- */
function initializeDH() {
    const dhGenerateBtn = document.getElementById('dh-generate');
    if (dhGenerateBtn) dhGenerateBtn.addEventListener('click', generateDHKeys);
}
function generateDHKeys() {
    document.getElementById('dh-public-key').value = "DH_PubKey_fictif_123";
    document.getElementById('dh-private-key').value = "DH_PrivKey_fictif_456";
    showAlert("Clés Diffie-Hellman (fictives) générées", "info");
}

/* ---------------------- ECC (exemple Web Crypto) ---------------------- */
function initializeECC() {
    const eccGenerateBtn = document.getElementById('ecc-generate');
    if (eccGenerateBtn) eccGenerateBtn.addEventListener('click', generateECCKeys);
}
async function generateECCKeys() {
    try {
        const keyPair = await crypto.subtle.generateKey(
            { name: "ECDH", namedCurve: "P-256" },
            true,
            ["deriveKey","deriveBits"]
        );
        const publicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
        const privateKey = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
        document.getElementById('ecc-public-key').value = arrayBufferToBase64(publicKey);
        document.getElementById('ecc-private-key').value = arrayBufferToBase64(privateKey);
        showAlert("Clés ECC générées (P-256)", "success");
    } catch (err) {
        showAlert("Erreur ECC: " + err, "error");
    }
}

/* ---------------------- ElGamal ---------------------- */
function initializeElGamal() {
    const elgamalGenerateBtn = document.getElementById('elgamal-generate');
    const elgamalCopyBtn = document.getElementById('elgamal-copy');
    const elgamalClearBtn = document.getElementById('elgamal-clear');

    if (elgamalGenerateBtn) elgamalGenerateBtn.addEventListener('click', generateSimplifiedElGamalKeys);
    if (elgamalCopyBtn)     elgamalCopyBtn.addEventListener('click', () => copyToClipboardMulti(['elgamal-public-key','elgamal-private-key'], elgamalCopyBtn));
    if (elgamalClearBtn)    elgamalClearBtn.addEventListener('click', () => clearFields('elgamal-public-key','elgamal-private-key'));
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
