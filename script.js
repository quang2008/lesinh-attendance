let html5QrCode = null;
let isProcessing = false;

const scanBtn = document.getElementById("scanBtn");
const result = document.getElementById("result");
const reader = document.getElementById("reader");

const API_URL = "https://script.google.com/macros/s/AKfycbz0lAZin7K_MAOBy2lJ6Q_fWr1eTlUr5hoyVLRPk7_MV1yJcvNHEfnTL6EwHfPHTU_1wA/exec"; // <-- Thay bằng URL Apps Script

scanBtn.addEventListener("click", startScan);

async function startScan() {

    if (isProcessing) return;

    result.innerHTML = "📷 Đang mở camera...";

    scanBtn.disabled = true;

    reader.innerHTML = "";

    html5QrCode = new Html5Qrcode("reader");

    try {

        await html5QrCode.start(
            {
                facingMode: "environment"
            },
            {
                fps: 10,
                qrbox: 250
            },
            onScanSuccess
        );

    } catch (err) {

        result.innerHTML = "❌ Không mở được camera<br>" + err;

        scanBtn.disabled = false;

    }

}

async function onScanSuccess(decodedText) {

    if (isProcessing) return;

    isProcessing = true;

    // Dừng camera NGAY để không quét lần 2
    try {

        await html5QrCode.stop();

        await html5QrCode.clear();

    } catch (e) {

        console.log(e);

    }

    result.innerHTML = "⏳ Đang điểm danh...";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: decodedText
            })

        });

        const data = await response.json();

        if (data.success) {

            result.innerHTML = `
                <div style="color:green;font-size:22px;">
                    ✅ Điểm danh thành công
                </div>

                <br>

                <b>${data.saint} ${data.name}</b>

                <br><br>

                Buổi: ${data.session}

                <br>

                Giờ: ${data.time}

                <br><br>

                <button id="againBtn">
                    📷 Quét tiếp
                </button>
            `;

        } else {

            result.innerHTML = `
                <div style="color:red;font-size:22px;">
                    ⚠ ${data.message}
                </div>

                <br>

                <b>${data.saint ?? ""} ${data.name ?? ""}</b>

                <br><br>

                <button id="againBtn">
                    📷 Quét tiếp
                </button>
            `;

        }

    } catch (err) {

        result.innerHTML = `
            ❌ Lỗi kết nối
            <br><br>
            ${err}
            <br><br>

            <button id="againBtn">
                📷 Quét lại
            </button>
        `;

    }

    document.getElementById("againBtn").onclick = () => {

        isProcessing = false;

        startScan();

    };

    scanBtn.disabled = false;

}
