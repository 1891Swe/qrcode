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
    });
});

// Function to generate URL QR code
function generateURLQR() {
    const url = document.getElementById('url').value;
    if (!url) {
        alert('Please enter a URL');
        return;
    }
    generateQR(url);
}

// Function to generate WiFi QR code
function generateWiFiQR() {
    const ssid = document.getElementById('ssid').value;
    const password = document.getElementById('password').value;
    const encryption = document.getElementById('encryption').value;

    if (!ssid) {
        alert('Please enter a network name');
        return;
    }

    // Format according to WiFi QR code standard
    const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    generateQR(wifiString);
}

// Function to generate QR code
function generateQR(data) {
    // Clear previous QR code
    document.getElementById('qrcode').innerHTML = '';
    
    // Generate new QR code with white background and black modules
    new QRCode(document.getElementById('qrcode'), {
        text: data,
        width: 200,
        height: 200,
        colorDark: '#000000',  // Black QR code
        colorLight: '#ffffff',  // White background
        correctLevel: QRCode.CorrectLevel.H
    });
}
