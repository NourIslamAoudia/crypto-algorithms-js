/**
 * Enhanced website navigation and UI functionality
 * 
 * This script handles:
 * - Mobile navigation toggle
 * - Tab switching for tool pages
 * - Copy to clipboard functionality
 * - Form clearing
 * - Alert notifications
 */
document.addEventListener('DOMContentLoaded', function() {
    // MOBILE NAVIGATION TOGGLE
    initializeNavToggle();
    
    // TAB FUNCTIONALITY
    initializeTabFunctionality();
    
    // COPY TO CLIPBOARD FUNCTIONALITY
    initializeCopyToClipboard();
    
    // CLEAR FUNCTIONALITY
    initializeClearFunctionality();
});

/**
 * Initializes the mobile navigation toggle
 */
function initializeNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
        
    if (navToggle && navList) {
        navToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

/**
 * Initializes tab functionality for tool pages
 */
function initializeTabFunctionality() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
                
            // Remove active class from all buttons and contents
            document.querySelectorAll('.tab-btn').forEach(tb => tb.classList.remove('active'));
            document.querySelectorAll('.tool-content').forEach(tc => tc.classList.remove('active'));
                
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

/**
 * Initializes copy to clipboard functionality
 */
function initializeCopyToClipboard() {
    document.querySelectorAll('[id$="-copy"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const prefix = this.id.replace('-copy', '');
            const resultTextarea = document.getElementById(`${prefix}-result`);
                
            if (resultTextarea && resultTextarea.value) {
                // Modern clipboard API
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(resultTextarea.value)
                        .then(() => showCopyFeedback(this))
                        .catch(err => showAlert('Failed to copy: ' + err, 'error'));
                } else {
                    // Fallback to older method
                    resultTextarea.select();
                    document.execCommand('copy');
                    showCopyFeedback(this);
                }
            }
        });
    });
}

/**
 * Shows visual feedback after successful copy
 * @param {HTMLElement} button - The button that was clicked
 */
function showCopyFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
    setTimeout(() => {
        button.innerHTML = originalText;
    }, 2000);
}

/**
 * Initializes functionality to clear form fields
 */
function initializeClearFunctionality() {
    document.querySelectorAll('[id$="-clear"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const prefix = this.id.replace('-clear', '');
            const textarea = document.getElementById(`${prefix}-text`);
            const resultTextarea = document.getElementById(`${prefix}-result`);
                
            if (textarea) textarea.value = '';
            if (resultTextarea) resultTextarea.value = '';
            
            showAlert('Fields cleared', 'info');
        });
    });
}

/**
 * Shows an alert notification at the top of the page
 * @param {string} message - The message to display
 * @param {string} type - The type of alert (success, error, info, warning)
 */
function showAlert(message, type = 'success') {
    // Créer un conteneur pour les alertes s'il n'existe pas
    let alertContainer = document.getElementById('alert-container');
    
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.style.position = 'fixed';
        alertContainer.style.top = '20px';
        alertContainer.style.left = '50%';
        alertContainer.style.transform = 'translateX(-50%)';
        alertContainer.style.zIndex = '1000';
        alertContainer.style.width = 'auto';
        alertContainer.style.maxWidth = '80%';
        document.body.appendChild(alertContainer);
    }
    
    // Créer l'élément d'alerte
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Style de l'alerte
    alert.style.padding = '10px 20px';
    alert.style.marginBottom = '10px';
    alert.style.borderRadius = '4px';
    alert.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.3s ease-in-out';
    
    // Couleur de fond selon le type
    switch(type) {
        case 'success':
            alert.style.backgroundColor = '#4CAF50';
            alert.style.color = 'white';
            break;
        case 'error':
            alert.style.backgroundColor = '#F44336';
            alert.style.color = 'white';
            break;
        case 'info':
            alert.style.backgroundColor = '#2196F3';
            alert.style.color = 'white';
            break;
        case 'warning':
            alert.style.backgroundColor = '#FF9800';
            alert.style.color = 'white';
            break;
    }
    
    // Ajouter au conteneur
    alertContainer.appendChild(alert);
    
    // Animation d'apparition
    setTimeout(() => {
        alert.style.opacity = '1';
    }, 10);
    
    // Suppression après un délai
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 300);
        
        // Supprimer le conteneur s'il est vide
        if (alertContainer.children.length === 0) {
            alertContainer.remove();
        }
    }, 3000);
}