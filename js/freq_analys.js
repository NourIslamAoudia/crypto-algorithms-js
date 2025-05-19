window.addEventListener('DOMContentLoaded', function() {
            const textArea = document.getElementById('freq-text');
            const resultArea = document.getElementById('freq-result');
            const btnFrequency = document.getElementById('btn-frequency');
            const btnIOC = document.getElementById('btn-ioc');
            const btnKasiski = document.getElementById('btn-kasiski');
            const btnClear = document.getElementById('btn-clear');

            btnFrequency.addEventListener('click', () => {
                const inputText = textArea.value.trim();
                if(!inputText) {
                    alert('Veuillez entrer un texte.');
                    return;
                }
                const frequencies = getLetterFrequencies(inputText);
                displayFrequencyResults(frequencies, inputText);
            });

            btnIOC.addEventListener('click', () => {
                const inputText = textArea.value.trim();
                if(!inputText) {
                    alert('Veuillez entrer un texte.');
                    return;
                }
                const ioc = indexOfCoincidence(inputText);
                const interpretation = interpretIOC(ioc);
                resultArea.value = `Index of Coincidence: ${ioc.toFixed(4)}\n\n${interpretation}`;
            });

            btnKasiski.addEventListener('click', () => {
                const inputText = textArea.value.trim();
                if(!inputText) {
                    alert('Veuillez entrer un texte.');
                    return;
                }
                const kasiskiRes = kasiskiExamination(inputText);
                displayKasiskiResults(kasiskiRes);
            });

            btnClear.addEventListener('click', () => {
                textArea.value = '';
                resultArea.value = '';
            });

            /**
             * Affichage amélioré des résultats de fréquence
             */
            function displayFrequencyResults(frequencies, originalText) {
                const cleanedText = originalText.toUpperCase().replace(/[^A-Z]/g, '');
                let result = `ANALYSE DE FRÉQUENCE\n`;
                result += `====================\n\n`;
                result += `Texte analysé: ${cleanedText.length} lettres\n`;
                result += `Texte original: ${originalText.length} caractères\n\n`;

                // Convertir les pourcentages en nombres pour le tri
                const freqEntries = Object.entries(frequencies).map(([letter, percent]) => [
                    letter, 
                    parseFloat(percent.replace('%', ''))
                ]);

                // Trier par fréquence décroissante
                freqEntries.sort((a, b) => b[1] - a[1]);

                result += `Fréquences (triées par ordre décroissant):\n`;
                result += `------------------------------------------\n`;
                
                freqEntries.forEach(([letter, freq]) => {
                    const bar = '█'.repeat(Math.max(1, Math.round(freq / 2)));
                    result += `${letter}: ${freq.toFixed(2)}% ${bar}\n`;
                });

                result += `\n\nFréquences théoriques du français:\n`;
                result += `E: 14.7%  A: 7.6%   I: 7.5%   S: 7.9%   N: 7.1%\n`;
                result += `R: 6.6%   T: 7.2%   O: 5.3%   L: 5.5%   U: 6.3%\n`;

                resultArea.value = result;
            }

            /**
             * Affichage amélioré des résultats Kasiski
             */
            function displayKasiskiResults(kasiskiRes) {
                let result = `EXAMEN DE KASISKI\n`;
                result += `=================\n\n`;

                if (kasiskiRes.length === 0) {
                    result += `Aucune séquence répétée trouvée.\n`;
                    result += `Le texte pourrait être:\n`;
                    result += `- Chiffré avec une clé très longue\n`;
                    result += `- Chiffré avec un algorithme non-périodique\n`;
                    result += `- Trop court pour l'analyse\n`;
                } else {
                    result += `${kasiskiRes.length} séquence(s) répétée(s) trouvée(s):\n\n`;
                    
                    let allDistances = [];
                    
                    kasiskiRes.forEach((item, index) => {
                        result += `${index + 1}. "${item.seq}" (${item.seq.length} lettres)\n`;
                        result += `   Positions: ${item.positions.join(', ')}\n`;
                        
                        // Calculer toutes les distances
                        const distances = [];
                        for (let i = 0; i < item.positions.length; i++) {
                            for (let j = i + 1; j < item.positions.length; j++) {
                                const distance = item.positions[j] - item.positions[i];
                                distances.push(distance);
                                allDistances.push(distance);
                            }
                        }
                        
                        if (distances.length > 0) {
                            result += `   Distances: ${distances.join(', ')}\n`;
                        }
                        result += `\n`;
                    });

                    // Analyse des longueurs de clé probables
                    if (allDistances.length > 0) {
                        const gcd = calculateGCD(allDistances);
                        const factorAnalysis = analyzeFactors(allDistances);
                        
                        result += `ANALYSE DES DISTANCES:\n`;
                        result += `----------------------\n`;
                        result += `Toutes les distances: ${allDistances.sort((a, b) => a - b).join(', ')}\n`;
                        result += `PGCD: ${gcd}\n\n`;
                        
                        result += `Longueurs de clé probables:\n`;
                        factorAnalysis.slice(0, 8).forEach(([factor, count]) => {
                            const percentage = ((count / allDistances.length) * 100).toFixed(1);
                            result += `${factor}: ${count}/${allDistances.length} (${percentage}%)\n`;
                        });
                    }
                }

                resultArea.value = result;
            }

            /**
             * Interprétation de l'IOC
             */
            function interpretIOC(ioc) {
                let interpretation = `Interprétation:\n`;
                
                if (ioc >= 0.065) {
                    interpretation += `IOC élevé (≥0.065) - Texte probablement en clair (français)\n`;
                    interpretation += `ou chiffrement monoalphabétique (César, substitution).`;
                } else if (ioc >= 0.045) {
                    interpretation += `IOC modéré (0.045-0.065) - Chiffrement polyalphabétique\n`;
                    interpretation += `probable (Vigenère) avec clé courte.`;
                } else if (ioc >= 0.035) {
                    interpretation += `IOC faible (0.035-0.045) - Chiffrement polyalphabétique\n`;
                    interpretation += `avec clé de longueur moyenne, ou chiffrement complexe.`;
                } else {
                    interpretation += `IOC très faible (<0.035) - Chiffrement fort, clé très longue,\n`;
                    interpretation += `ou données quasi-aléatoires.`;
                }

                interpretation += `\n\nRéférences:\n`;
                interpretation += `- Français: ~0.078\n`;
                interpretation += `- Anglais: ~0.067\n`;
                interpretation += `- Aléatoire: ~0.038`;

                return interpretation;
            }

            /**
             * Analyse des facteurs pour Kasiski
             */
            function analyzeFactors(distances) {
                const factorCount = {};
                
                distances.forEach(distance => {
                    // Trouver tous les facteurs de cette distance
                    for (let factor = 2; factor <= distance; factor++) {
                        if (distance % factor === 0) {
                            factorCount[factor] = (factorCount[factor] || 0) + 1;
                        }
                    }
                });

                // Convertir en tableau et trier par fréquence
                return Object.entries(factorCount)
                    .map(([factor, count]) => [parseInt(factor), count])
                    .sort((a, b) => b[1] - a[1]);
            }
        });

        /**
         * Calcule la fréquence des lettres a-z (insensible à la casse).
         */
        function getLetterFrequencies(text) {
            const freq = {};
            const letters = text.toUpperCase().replace(/[^A-Z]/g, '');
            
            // Compter toutes les lettres présentes
            for(const c of letters) {
                freq[c] = (freq[c] || 0) + 1;
            }
            
            const total = letters.length || 1;
            
            // Convertir en pourcentages
            for(const c in freq) {
                freq[c] = ((freq[c] / total) * 100).toFixed(2) + '%';
            }
            
            return freq;
        }

        /**
         * Calcule l'Index of Coincidence (IOC).
         * IOC = (1 / (N*(N-1))) * SUM( freq[i] * (freq[i] - 1) )
         */
        function indexOfCoincidence(text) {
            const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
            const length = cleaned.length;
            
            if(length < 2) return 0;
            
            const counts = {};
            for(const c of cleaned) {
                counts[c] = (counts[c] || 0) + 1;
            }
            
            let numerator = 0;
            for(const c in counts) {
                numerator += counts[c] * (counts[c] - 1);
            }
            
            return numerator / (length * (length - 1));
        }

        /**
         * Examen de Kasiski amélioré:
         * Recherche de substrings répétés (3-6 lettres) et calcul des positions.
         */
        function kasiskiExamination(text) {
            const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
            const results = [];
            const foundSequences = new Set();
            
            // Rechercher des séquences de 3 à 6 caractères
            for(let size = 3; size <= Math.min(6, Math.floor(cleaned.length / 2)); size++) {
                for(let i = 0; i <= cleaned.length - size; i++) {
                    const seq = cleaned.substring(i, i + size);
                    
                    // Ignorer les séquences déjà trouvées ou trop répétitives
                    if(foundSequences.has(seq) || /^(.)\1+$/.test(seq)) continue;
                    
                    // Chercher toutes les occurrences de cette séquence
                    const positions = [];
                    for(let j = 0; j <= cleaned.length - size; j++) {
                        if(cleaned.substring(j, j + size) === seq) {
                            positions.push(j);
                        }
                    }
                    
                    // Si au moins 2 occurrences trouvées
                    if(positions.length >= 2) {
                        foundSequences.add(seq);
                        results.push({seq, positions});
                    }
                }
            }
            
            // Trier par longueur de séquence (plus longues d'abord) puis par nombre d'occurrences
            results.sort((a, b) => {
                if(a.seq.length !== b.seq.length) {
                    return b.seq.length - a.seq.length;
                }
                return b.positions.length - a.positions.length;
            });
            
            return results;
        }

        /**
         * Calcule le PGCD de plusieurs nombres
         */
        function calculateGCD(numbers) {
            if(numbers.length === 0) return 0;
            if(numbers.length === 1) return numbers[0];
            
            function gcd(a, b) {
                while(b !== 0) {
                    const temp = b;
                    b = a % b;
                    a = temp;
                }
                return a;
            }
            
            let result = numbers[0];
            for(let i = 1; i < numbers.length; i++) {
                result = gcd(result, numbers[i]);
                if(result === 1) break; // Optimisation: si PGCD = 1, pas besoin de continuer
            }
            
            return result;
        }