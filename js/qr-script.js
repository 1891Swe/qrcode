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

// Function to generate URL QR code
function generateURLQR() {
    const url = document.getElementById('url').value;
    const logoFile = document.getElementById('logoUrl').files[0];
    const logoSize = document.getElementById('logoSizeUrl').value;
    
    if (!url) {
        alert('Please enter a URL');
        return;
    }

    if (logoFile) {
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

    if (!ssid) {
        alert('Please enter a network name');
        return;
    }

    // Format according to WiFi QR code standard
    const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    
    if (logoFile) {
        generateQRWithLogo(wifiString, logoFile, logoSize);
    } else {
        generateQR(wifiString);
    }
}

// Function to generate basic QR code (without logo)
function generateQR(data) {
    // Clear previous QR code
    document.getElementById('qrcode').innerHTML = '';
    document.getElementById('download-container').style.display = 'none';
    
    // Generate new QR code
    new QRCode(document.getElementById('qrcode'), {
        text: data,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Show download button after QR code is generated
    setTimeout(() => {
        setupDownloadButton();
    }, 100);
}

// Function to generate QR code with logo
function generateQRWithLogo(data, logoFile, logoSizePercent) {
    // Clear previous QR code
    document.getElementById('qrcode').innerHTML = '';
    document.getElementById('download-container').style.display = 'none';
    
    // Create QR code instance
    const qrcode = new QRCode(document.getElementById('qrcode'), {
        text: data,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Wait for QR code to be generated
    setTimeout(() => {
        // Get the canvas
        const canvas = document.querySelector('#qrcode canvas');
        const ctx = canvas.getContext('2d');
        
        // Create image from uploaded logo
        const img = new Image();
        const reader = new FileReader();
        
        reader.onload = function(e) {
            img.src = e.target.result;
            
            img.onload = function() {
                // Calculate logo size (percentage of QR code size)
                const logoWidth = canvas.width * (logoSizePercent / 100);
                const logoHeight = logoWidth * (img.height / img.width);
                
                // Calculate position to center the logo
                const logoX = (canvas.width - logoWidth) / 2;
                const logoY = (canvas.height - logoHeight) / 2;
                
                // Clear the center area
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(logoX, logoY, logoWidth, logoHeight);
                
                // Draw logo
                ctx.drawImage(img, logoX, logoY, logoWidth, logoHeight);
                
                // Show download button
                setupDownloadButton();
            };
        };
        
        reader.readAsDataURL(logoFile);
    }, 100);
}

// Function to setup download button
function setupDownloadButton() {
    const downloadContainer = document.getElementById('download-container');
    const downloadBtn = document.getElementById('download-btn');
    
    downloadContainer.style.display = 'block';
    
    downloadBtn.onclick = function() {
        const canvas = document.querySelector('#qrcode canvas');
        const url = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = url;
        link.click();
    };
}
