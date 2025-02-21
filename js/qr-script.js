// Tab switching functionality
const tabs = document.querySelectorAll('.tab-button');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab + 'Tab').classList.add('active');
        
        // Clear QR code when switching tabs
        document.getElementById('qrcode').innerHTML = '';
        document.getElementById('download-container').style.display = 'none';
    });
});

// Update logo size display value
document.getElementById('logoSizeUrl').addEventListener('input', function() {
    document.getElementById('logoSizeValueUrl').textContent = this.value + '%';
});

document.getElementById('logoSizeWifi').addEventListener('input', function() {
    document.getElementById('logoSizeValueWifi').textContent = this.value + '%';
});

// Add file validation for logo uploads
document.getElementById('logoUrl').addEventListener('change', function() {
    validateLogoFile(this, 'logoUrlError');
});

document.getElementById('logoWifi').addEventListener('change', function() {
    validateLogoFile(this, 'logoWifiError');
});

// Function to validate logo file
function validateLogoFile(fileInput, errorElementId) {
    const errorElement = document.getElementById(errorElementId);
    errorElement.textContent = '';
    
    if (fileInput.files.length === 0) return;
    
    const file = fileInput.files[0];
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    
    // Check file size
    if (file.size > maxSizeInBytes) {
        errorElement.textContent = 'File size exceeds 1MB. Please choose a smaller image.';
        fileInput.value = ''; // Clear the file input
        return;
    }
    
    // Check image dimensions
    const img = new Image();
    img.onload = function() {
        const width = this.width;
        const height = this.height;
        
        // Check if dimensions are extremely large
        if (width > 2000 || height > 2000) {
            errorElement.textContent = 'Image dimensions too large. Please use an image under 2000x2000px.';
            fileInput.value = ''; // Clear the file input
        }
        
        // Warn if not square (but still allow it)
        const aspectRatio = width / height;
        if (aspectRatio < 0.9 || aspectRatio > 1.1) {
            errorElement.textContent = 'Warning: Non-square images may not display optimally.';
        }
    };
    
    img.onerror = function() {
        errorElement.textContent = 'Invalid image file. Please choose another.';
        fileInput.value = ''; // Clear the file input
    };
    
    // Load the image to check dimensions
    const reader = new FileReader();
    reader.onload = function(e) {
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Function to generate URL QR code
function generateURLQR() {
    const url = document.getElementById('url').value;
    const logoFile = document.getElementById('logoUrl').files[0];
    const logoSize = document.getElementById('logoSizeUrl').value;
    const errorElement = document.getElementById('logoUrlError');
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    
    // Clear any previous error messages
    errorElement.textContent = '';

    if (logoFile) {
        // Validate file size once more before proceeding
        if (logoFile.size > 1 * 1024 * 1024) {
            errorElement.textContent = 'File size exceeds 1MB. Please choose a smaller image.';
            return;
        }
        generateQRWithLogo(url, logoFile, logoSize);
    } else {
        generateQR(url);
    }
}

// Function to generate WiFi QR code
function generateWiFiQR() {
    const ssid = document.getElementById('ssid').value;
    const password = document.getElementById('password').value;
    const encryption = document.getElementById('encryption').value;
    const logoFile = document.getElementById('logoWifi').files[0];
    const logoSize = document.getElementById('logoSizeWifi').value;
    const errorElement = document.getElementById('logoWifiError');

    if (!ssid) {
        alert('Please enter a network name');
        return;
    }
    
    // Clear any previous error messages
    errorElement.textContent = '';

    // Format according to WiFi QR code standard
    const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    
    if (logoFile) {
        // Validate file size once more before proceeding
        if (logoFile.size > 1 * 1024 * 1024) {
            errorElement.textContent = 'File size exceeds 1MB. Please choose a smaller image.';
            return;
        }
        generateQRWithLogo(wifiString, logoFile, logoSize);
    } else {
        generateQR(wifiString);
    }
}

// Function to generate QR code (without logo)
function generateQR(data) {
    // Clear previous QR code
    document.getElementById('qrcode').innerHTML = '';
    document.getElementById('download-container').style.display = 'none';
    
    // Generate new QR code
    new QRCode(document.getElementById('qrcode'), {
        text: data,
        width: 200,
        height: 200,
        colorDark: '#000000',  // Black QR code
        colorLight: '#ffffff',  // White background
        correctLevel: QRCode.CorrectLevel.H  // Highest error correction level
    });
    
    // Show download button after QR code is generated
    setTimeout(() => {
        setupDownloadButton();
    }, 200);
}

// Function to generate QR code with logo
function generateQRWithLogo(data, logoFile, logoSizePercent) {
    // First, generate a normal QR code
    generateQR(data);
    
    // Once QR code is generated, add the logo
    setTimeout(() => {
        const canvas = document.querySelector('#qrcode canvas');
        
        if (!canvas) {
            console.error('QR Code canvas not found');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        
        // Create image from uploaded logo
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = function(e) {
            img.onload = function() {
                // Calculate logo size (percentage of QR code size)
                const size = parseInt(logoSizePercent) / 100;
                const logoWidth = canvas.width * size;
                const logoHeight = canvas.height * size;
                
                // Calculate position to center the logo
                const logoX = (canvas.width - logoWidth) / 2;
                const logoY = (canvas.height - logoHeight) / 2;
                
                // Create white background for logo
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(logoX, logoY, logoWidth, logoHeight);
                
                // Draw logo on top of QR code
                ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
                
                // Update download button to use the new canvas with logo
                setupDownloadButton();
            };
            
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(logoFile);
    }, 300); // Wait for QR code to be fully rendered
}

// Function to setup download button
function setupDownloadButton() {
    const downloadContainer = document.getElementById('download-container');
    const downloadBtn = document.getElementById('download-btn');
    
    downloadContainer.style.display = 'block';
    
    downloadBtn.onclick = function() {
        const canvas = document.querySelector('#qrcode canvas');
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = url;
            link.click();
        } else {
            alert('No QR code generated yet!');
        }
    };
}
