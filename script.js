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
                    "✅ Đã quét: <b>" + decodedText + "</b>";

                scanner.stop();

            }
        );

    } catch (err) {

        document.getElementById("result").innerHTML =
            "❌ " + err;

        console.error(err);

    }

});
