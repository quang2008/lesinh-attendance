let scanner = null;

document.getElementById("scanBtn").addEventListener("click", async () => {

    document.getElementById("result").innerHTML = "Đang mở camera...";

    scanner = new Html5Qrcode("reader");

    try {

        await scanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: 250
            },
            (decodedText) => {

               document.getElementById("result").innerHTML =
    "⏳ Đang điểm danh...";

fetch("https://script.google.com/macros/s/AKfycbwTy6P7af2-RJY3XrmyQEDFi6ZE_laX8Gz_V-sIXj0D57TKv26V-C4E8eIzKXG5m4Kw3A/exec", {
    method: "POST",
    body: JSON.stringify({
        id: decodedText
    })
})
.then(res => res.json())
.then(data => {

    document.getElementById("result").innerHTML =
        "✅ Điểm danh thành công<br><b>" + decodedText + "</b>";

    scanner.stop();

})
.catch(err => {

    document.getElementById("result").innerHTML =
        "❌ " + err;

});
            }
        );

    } catch (err) {

        document.getElementById("result").innerHTML =
            "❌ " + err;

        console.error(err);

    }

});
