const contentLogs = document.getElementById("content-logs");
console.log(contentLogs);

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
        contentLogs.innerHTML += `<p class="d-flex align-items-center"><span class="text-success mr-2" style="font-size: 25px">&bull;</span> ${messageJSON['join_time']}: ${messageJSON['name']} ${messageJSON['content']}</p>`;
    } else if (topic === "zoom/participant/left") {
        contentLogs.innerHTML += `<p class="d-flex align-items-center"><span class="text-danger mr-2" style="font-size: 25px">&bull;</span> ${messageJSON['leave_time']}: ${messageJSON['name']} ${messageJSON['content']} </p>`;
    }
});

client.on("error", function (err) {
    console.error("Lỗi MQTT:", err);
});

client.on("close", function () {
    console.log("Đã đóng kết nối MQTT.");
});