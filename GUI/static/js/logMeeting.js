const contentLogs = document.getElementById("content-logs");

const client = mqtt.connect("wss://7135442a5e904296bf8f44f17ea3feec.s1.eu.hivemq.cloud:8884/mqtt", {
    username: "tienhiep345",
    password: "Hiep2003",
});

client.on("connect", function () {
    console.log("Kết nối MQTT thành công!");
    let topics = ["zoom/participant/joined", "zoom/participant/left"];
    client.subscribe(topics, function (err) {
        if (!err) {
            console.log("Đã đăng ký 2 chủ đề");
        } else {
            console.error("Lỗi khi đăng ký chủ đề:", err);
        }
    });
});

client.on("message", function (topic, message) {
    let messageJSON = JSON.parse(message.toString());
    if (topic === "zoom/participant/joined") {
        contentLogs.innerHTML += `<span style="color: green">${messageJSON['message']}</span><br>`;
    } else if (topic === "zoom/participant/left") {
        console.log("Có người rời cuộc họp:", message.toString());
    }
});

client.on("error", function (err) {
    console.error("Lỗi MQTT:", err);
});

client.on("close", function () {
    console.log("Đã đóng kết nối MQTT.");
});