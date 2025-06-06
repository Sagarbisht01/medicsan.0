// Global state
let currentAnalysisResult = null;
let isFlashOn = false;

// API functions
async function analyzeImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('/api/analyze-medicine', {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
}

async function searchMedicines(query) {
    const response = await fetch(`/api/medicines/search?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
}

async function getRecentScans(limit = 10) {
    const response = await fetch(`/api/scans/recent?limit=${limit}`, {
        method: 'GET',
        credentials: 'include',
    });
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
}

// Toast notifications
function showToast(title, description, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
}

// File validation
function validateFile(file) {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        showToast('File too large', 'Please select an image smaller than 10MB', 'error');
        return false;
    }

    if (!file.type.startsWith('image/')) {
        showToast('Invalid file type', 'Please select an image file', 'error');
        return false;
    }

    return true;
}

// Show/hide loading state
function setLoadingState(isLoading) {
    const loadingState = document.getElementById('loadingState');
    const cameraBtn = document.getElementById('cameraBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    
    if (isLoading) {
        loadingState.style.display = 'flex';
        cameraBtn.disabled = true;
        uploadBtn.disabled = true;
    } else {
        loadingState.style.display = 'none';
        cameraBtn.disabled = false;
        uploadBtn.disabled = false;
    }
}

// Handle image capture/upload
async function handleImageCapture(file) {
    if (!validateFile(file)) return;
    
    setLoadingState(true);
    
    try {
        const result = await analyzeImage(file);
        
        if (result.success && result.data) {
            currentAnalysisResult = result.data;
            displayResults(result.data);
            showToast('Analysis complete', `Found ${result.data.alternatives.length} alternatives`, 'success');
            loadRecentScans(); // Refresh recent scans
        } else {
            showToast('Analysis failed', result.error || 'Could not analyze the medicine image', 'error');
        }
    } catch (error) {
        showToast('Analysis error', error.message, 'error');
    } finally {
        setLoadingState(false);
    }
}

// Display analysis results
function displayResults(data) {
    const resultsSection = document.getElementById('resultsSection');
    const medicineResults = document.getElementById('medicineResults');
    const alternativesGrid = document.getElementById('alternativesGrid');
    const comparisonTableBody = document.getElementById('comparisonTableBody');
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Display scanned medicine
    medicineResults.innerHTML = createMedicineResultsHTML(data.extractedInfo);
    
    // Display alternatives
    alternativesGrid.innerHTML = data.alternatives.map(createAlternativeCardHTML).join('');
    
    // Display comparison table
    comparisonTableBody.innerHTML = createComparisonTableHTML(data.extractedInfo, data.alternatives);
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Create medicine results HTML
function createMedicineResultsHTML(extractedInfo) {
    return `
        <div class="medicine-header">
            <div class="medicine-header-content">
                <div class="medicine-info">
                    <h4>${extractedInfo.name}</h4>
                    <p class="medicine-ingredients">
                        ${extractedInfo.strength} ${extractedInfo.activeIngredients.join(", ")}
                    </p>
                </div>
                <div class="medicine-price">
                    <p class="price">$10.00</p>
                    <p class="form">${extractedInfo.form}</p>
                </div>
            </div>
        </div>
        
        <div class="medicine-details">
            <div class="ingredients-section">
                <h5>Active Ingredients</h5>
                <div class="ingredient-badges">
                    ${extractedInfo.activeIngredients.map(ingredient => 
                        `<span class="ingredient-badge">${ingredient} ${extractedInfo.strength}</span>`
                    ).join('')}
                </div>
            </div>

            <div class="medicine-meta">
                <div class="meta-item">
                    <span class="meta-label">Brand:</span>
                    <span class="meta-value">${extractedInfo.brand}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Form:</span>
                    <span class="meta-value">${extractedInfo.form}</span>
                </div>
                ${extractedInfo.manufacturer ? `
                <div class="meta-item">
                    <span class="meta-label">Manufacturer:</span>
                    <span class="meta-value">${extractedInfo.manufacturer}</span>
                </div>
                ` : ''}
                <div class="meta-item">
                    <span class="meta-label">Confidence:</span>
                    <span class="meta-value">${(extractedInfo.confidence * 100).toFixed(0)}%</span>
                </div>
            </div>
        </div>
    `;
}

// Create alternative card HTML
function createAlternativeCardHTML(alternative) {
    const savingsAmount = parseFloat(alternative.savings);
    let savingsClass = 'savings-low';
    if (savingsAmount >= 8) savingsClass = 'savings-high';
    else if (savingsAmount >= 3) savingsClass = 'savings-medium';

    const availabilityIcon = getAvailabilityIcon(alternative.availability);

    return `
        <div class="alternative-card">
            <div class="alternative-header">
                <div class="alternative-info">
                    <h5>${alternative.name}</h5>
                    <p class="alternative-manufacturer">${alternative.manufacturer}</p>
                </div>
                <div class="savings-badge ${savingsClass}">
                    Save $${alternative.savings}
                </div>
            </div>
            
            <div class="alternative-pricing">
                <div class="price-main">
                    <span class="price-amount">$${alternative.price}</span>
                    <span class="price-quantity">${alternative.quantity} ${alternative.form.toLowerCase()}</span>
                </div>
                <div class="price-per-unit">
                    $${alternative.pricePerUnit} per ${alternative.form.toLowerCase().slice(0, -1)}
                </div>
            </div>

            <div class="alternative-features">
                <div class="feature-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 12l2 2 4-4"/>
                        <circle cx="12" cy="12" r="9"/>
                    </svg>
                    <span>Same active ingredient</span>
                </div>
                <div class="feature-item">
                    ${availabilityIcon}
                    <span>${alternative.availability}</span>
                </div>
            </div>

            <button class="select-btn" onclick="selectAlternative(${alternative.id})">
                Select This Option
            </button>
        </div>
    `;
}

// Get availability icon
function getAvailabilityIcon(availability) {
    if (availability.toLowerCase().includes('pickup')) {
        return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16,8 20,8 23,11 23,16 16,16"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>`;
}

// Create comparison table HTML
function createComparisonTableHTML(originalMedicine, alternatives) {
    const originalRow = `
        <tr class="original-row">
            <td>
                <div class="medicine-name">${originalMedicine.name}</div>
                <div class="medicine-details-small">
                    ${originalMedicine.brand} • ${originalMedicine.form}
                </div>
            </td>
            <td class="price-cell">$10.00</td>
            <td>-</td>
            <td><span class="badge badge-blue">Original</span></td>
            <td><span class="badge badge-green">Scanned</span></td>
        </tr>
    `;

    const alternativeRows = alternatives.map(alternative => `
        <tr>
            <td>
                <div class="medicine-name">${alternative.name}</div>
                <div class="medicine-details-small">
                    ${alternative.manufacturer} • ${alternative.quantity} ${alternative.form.toLowerCase()}
                </div>
            </td>
            <td class="price-cell">$${alternative.price}</td>
            <td>$${alternative.pricePerUnit}</td>
            <td><span class="badge badge-green">Save $${alternative.savings}</span></td>
            <td><span class="badge badge-green">${alternative.availability}</span></td>
        </tr>
    `).join('');

    return originalRow + alternativeRows;
}

// Handle alternative selection
function selectAlternative(alternativeId) {
    if (!currentAnalysisResult) return;
    
    const alternative = currentAnalysisResult.alternatives.find(alt => alt.id === alternativeId);
    if (alternative) {
        showToast('Alternative selected', `You could save $${alternative.savings} with ${alternative.name}`, 'success');
    }
}

// Handle search
async function handleSearch(query) {
    if (!query.trim()) return;
    
    try {
        const result = await searchMedicines(query.trim());
        
        if (result.success && result.data) {
            // For now, just show a toast. You could implement search results display here
            showToast('Search complete', `Found ${result.data.length} medicines`, 'success');
            console.log('Search results:', result.data);
        } else {
            showToast('Search failed', result.error || 'Could not search medicines', 'error');
        }
    } catch (error) {
        showToast('Search error', error.message, 'error');
    }
}

// Load recent scans
async function loadRecentScans() {
    try {
        const result = await getRecentScans(5);
        
        if (result.success && result.data && result.data.length > 0) {
            displayRecentScans(result.data);
        }
    } catch (error) {
        console.error('Error loading recent scans:', error);
    }
}

// Display recent scans
function displayRecentScans(scans) {
    const recentScans = document.getElementById('recentScans');
    const recentScansList = document.getElementById('recentScansList');
    
    recentScans.style.display = 'block';
    
    recentScansList.innerHTML = scans.map(scan => {
        const extractedData = JSON.parse(scan.extractedData);
        return `
            <div class="scan-item">
                <div class="scan-info">
                    <div class="scan-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.5 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z"/>
                        </svg>
                    </div>
                    <div class="scan-details">
                        <h5>${extractedData.name || scan.originalName}</h5>
                        <p class="scan-date">Scanned ${new Date(scan.scanDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <button class="view-btn" onclick="viewScanResults(${scan.id})">
                    View Results
                </button>
            </div>
        `;
    }).join('');
}

// View scan results (placeholder function)
function viewScanResults(scanId) {
    showToast('View Results', 'Scan details functionality coming soon', 'info');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const cameraBtn = document.getElementById('cameraBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const flashBtn = document.getElementById('flashBtn');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cameraPreview = document.querySelector('.camera-preview');
    
    // File input change
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleImageCapture(file);
        }
    });
    
    // Camera button click
    cameraBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Upload button click
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Camera preview click
    cameraPreview.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Flash button click
    flashBtn.addEventListener('click', function() {
        isFlashOn = !isFlashOn;
        flashBtn.classList.toggle('active', isFlashOn);
        showToast(
            isFlashOn ? 'Flash enabled' : 'Flash disabled',
            'Flash setting updated',
            'info'
        );
    });
    
    // Search form submit
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleSearch(searchInput.value);
    });
    
    // Category filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Handle search by category
            const category = this.getAttribute('data-category');
            handleSearch(category);
        });
    });
    
    // Bottom navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            navBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Load recent scans on page load
    loadRecentScans();
});

// Drag and drop functionality
document.addEventListener('DOMContentLoaded', function() {
    const cameraPreview = document.querySelector('.camera-preview');
    
    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        cameraPreview.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
    
    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        cameraPreview.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        cameraPreview.addEventListener(eventName, unhighlight, false);
    });
    
    // Handle dropped files
    cameraPreview.addEventListener('drop', handleDrop, false);
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function highlight(e) {
        cameraPreview.style.background = '#e0f2fe';
        cameraPreview.style.borderColor = '#1d4ed8';
    }
    
    function unhighlight(e) {
        cameraPreview.style.background = '#f1f5f9';
        cameraPreview.style.borderColor = '#2563eb';
    }
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            handleImageCapture(files[0]);
        }
    }
});