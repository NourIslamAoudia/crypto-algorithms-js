# Projet Crypt-Decrypt 🔐

Ce projet présente diverses techniques de cryptographie, allant des chiffres classiques (César, Vigenère…) aux algorithmes modernes (AES, DES, RSA, ElGamal), ainsi que des fonctionnalités d'analyse de fréquence (Index of Coincidence, Kasiski). L'objectif est d'offrir une plateforme éducative illustrant :

- Le chiffrement et le déchiffrement symétriques (AES, ChaCha20, Blowfish, DES)
- Le chiffrement et le déchiffrement asymétriques (RSA, ElGamal, Diffie-Hellman, ECC)
- L'analyse de fréquence et quelques outils de cryptanalyse (IOC, Kasiski)

## ✨ Fonctionnalités principales

- **Interface web intuitive** organisée par type de chiffrement
- **Génération simplifiée de clés** pour RSA et ElGamal
- **Démonstrations interactives** pour chaque algorithme
- **Analyse de texte** pour déterminer son niveau de protection (via l'Index of Coincidence)

## 📁 Structure du projet

```
CRYPTO-ALGORITHMS-JS/
├── index.html              # Page d'accueil, introduction et navigation
├── classic.html            # Chiffrements classiques (César, Vigenère...)
├── symmetric.html          # Chiffrements symétriques (AES, DES...)
├── asymmetric.html         # Chiffrements asymétriques (RSA, ElGamal...)
├── freq_analys.html        # Analyse de fréquence et cryptanalyse
├── assets/                 # Ressources statiques
│   └── images/            # Images et icônes
│       ├── Cryptography.jpg
│       └── private-key.png
├── css/                   # Feuilles de style
│   ├── home.css          # Styles page d'accueil
│   ├── pages.css         # Styles pages secondaires
│   └── style.css         # Styles généraux
└── js/                   # Scripts JavaScript
    ├── asymmetric.js     # Algorithmes asymétriques
    ├── classic.js        # Algorithmes classiques
    ├── freq_analys.js    # Analyse de fréquence
    ├── main.js           # Script principal
    └── symmetric.js      # Algorithmes symétriques
```

## 🚀 Installation et exécution

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/votre-username/crypto-algorithms-js.git
   cd crypto-algorithms-js
   ```

2. **Ouvrir dans un navigateur**
   - Ouvrir `index.html` dans un navigateur moderne (Chrome, Firefox, Safari, Edge)
   - Aucune installation supplémentaire requise

3. **Explorer les fonctionnalités**
   - Naviguer entre les différentes sections (Classique, Symétrique, Asymétrique, etc.)
   - Tester les algorithmes de chiffrement et déchiffrement
   - Utiliser les outils d'analyse de fréquence

## 🔧 Algorithmes supportés

### Chiffrements Classiques
- **César** - Décalage alphabétique simple
- **Vigenère** - Chiffrement polyalphabétique
- **Playfair** - Chiffrement par bigrammes
- **Rail Fence** - Transposition en zigzag

### Chiffrements Symétriques
- **AES** (Advanced Encryption Standard)
- **DES** (Data Encryption Standard)
- **ChaCha20** - Chiffrement de flux moderne
- **Blowfish** - Algorithme de Schneier

### Chiffrements Asymétriques
- **RSA** - Rivest-Shamir-Adleman
- **ElGamal** - Chiffrement basé sur le logarithme discret
- **Diffie-Hellman** - Échange de clés
- **ECC** (Elliptic Curve Cryptography)

### Analyse Cryptographique
- **Index of Coincidence (IOC)** - Mesure de l'aléatoire du texte
- **Test de Kasiski** - Détection de répétitions
- **Analyse de fréquence** - Distribution des caractères

## 🎯 Utilisation

1. **Sélectionner un type de chiffrement** depuis la page d'accueil
2. **Choisir l'algorithme** désiré
3. **Saisir le texte** à chiffrer/déchiffrer
4. **Générer ou saisir une clé** (selon l'algorithme)
5. **Exécuter l'opération** et observer le résultat
6. **Analyser le texte** avec les outils de cryptanalyse

## 🛡️ Sécurité et limitations

⚠️ **Avertissement** : Ce projet est à des fins éducatives uniquement. Les implémentations peuvent ne pas être adaptées à un usage en production pour des données sensibles.

- Les algorithmes classiques sont vulnérables aux attaques modernes
- Certaines implémentations peuvent être simplifiées pour la démonstration
- Utilisez des bibliothèques cryptographiques établies pour les applications réelles

## 🤝 Contributions

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. **Créer une branche** pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commiter** vos changements (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir une Pull Request**

### Types de contributions recherchées
- Amélioration de la sécurité des implémentations
- Ajout de nouveaux algorithmes
- Amélioration de l'interface utilisateur
- Correction de bugs
- Documentation et exemples
- Tests unitaires

## 📋 Prérequis

- **Navigateur moderne** avec support JavaScript ES6+
- **Connexion internet** (pour certaines bibliothèques CDN)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Communauté cryptographique pour les algorithmes et méthodes
- Contributeurs open source pour les bibliothèques utilisées
- Ressources éducatives en cryptographie

---

**Note** : Ce projet est destiné à l'apprentissage et à la démonstration. Pour des applications de production, utilisez toujours des bibliothèques cryptographiques auditées et reconnues.