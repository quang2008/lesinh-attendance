let scanner = null;
let scanned = false;

const btnScan = document.getElementById("scanBtn");
const result = document.getElementById("result");

btnScan.addEventListener("click", startScanner);

async function startScanner() {

    scanned = false;

    result.innerHTML = "📷 Đang mở camera...";

    // Nếu đã có scanner cũ thì xóa
    if (scanner) {
        try {
            await scanner.clear();
        } catch (e) {}
    }

    scanner = new Html5Qrcode("reader");

    try {

        await scanner.start(
            {
                facingMode: "environment"
            },
            {
                fps: 10,
                qrbox: 250
            },
            onScanSuccess,
            () => {}
        );

    } catch (err) {

        result.innerHTML = "❌ Không mở được camera<br>" + err;

    }

}

async function onScanSuccess(decodedText) {

    if (scanned) return;

    scanned = true;

    result.innerHTML = "⏳ Đang điểm danh...";

    // Dừng camera ngay để tránh quét nhiều lần
    try {
        await scanner.stop();
    } catch (e) {}

    fetch("https://script.google.com/macros/s/AKfycbwTy6P7af2-RJY3XrmyQEDFi6ZE_laX8Gz_V-sIXj0D57TKv26V-C4E8eIzKXG5m4Kw3A/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: decodedText
        })
    })
    .then(res => res.json())
    .then(data => {

        result.innerHTML = `
            <h2>✅ Điểm danh thành công</h2>
            <h3>${decodedText}</h3>
            <br>
            <button id="againBtn">
                Quét tiếp
            </button>
        `;

        document.getElementById("againBtn").onclick = () => {

            document.getElementById("reader").innerHTML = "";

            startScanner();

        };

    })
    .catch(err => {

        scanned = false;

        result.innerHTML = `
            ❌ Lỗi gửi dữ liệu<br><br>
            ${err}
        `;

    });

}
