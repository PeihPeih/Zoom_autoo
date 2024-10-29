document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("create-meeting-modal");
  const btn = document.getElementById("create-meeting-btn");
  const span = document.getElementsByClassName("close")[0];
  const form = document.getElementById("create-meeting-form");
  const userId = "zcxsTyXdQZGhk5VLjLPyjw"; // Replace with the actual user ID
  const accessToken = "your_access_token"; // Replace with the actual access token

  btn.onclick = function () {
    modal.style.display = "block";
  };

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  form.onsubmit = async function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const data = {
      topic: formData.get("topic"),
      start_time: formData.get("start_time"),
      duration: parseInt(formData.get("duration")),
      timezone: formData.get("timezone"),
      agenda: formData.get("agenda"),
      type: parseInt(formData.get("type")), // Include the type field
      invitees: formData
        .get("invitees")
        .split(",")
        .map((email) => email.trim()),
    };

    try {
      const response = await fetch("/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        alert("Cuộc họp đã được tạo thành công!");
        modal.style.display = "none";
      } else {
        const error = await response.json();
        alert("Lỗi: " + error.detail);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi tạo cuộc họp.");
    }
  };
  async function fetchUpcomingMeetings() {
    try {
      const response = await fetch(`/meetings/users/${userId}`, {
        method: "GET",
      });

      if (response.ok) {
        const meetings = await response.json();
        populateMeetingTable(meetings);
        currentMeetingTable(meetings);
      } else {
        const error = await response.json();
        console.error("Error fetching meetings:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function populateMeetingTable(meetings) {
    const tbody = document
      .getElementById("upcoming-meetings-table")
      .getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; // Clear existing rows

    const now = new Date();
    meetings.forEach((meeting) => {
      const startTime = new Date(meeting.start_time);
      const endTime = new Date(startTime.getTime() + meeting.duration * 60000);
      console.log(startTime, endTime);
      if (startTime > now) {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = meeting.topic;
        row.insertCell(1).innerText = startTime.toLocaleString();
        row.insertCell(2).innerText = meeting.duration;
        row.insertCell(
          3
        ).innerHTML = `<button onclick="manageMeeting('${meeting.id}')">Quản lý</button>`;
        row.insertCell(
          4
        ).innerHTML = `<button onclick="joinMeeting('${meeting.id}')">Tham gia</button>`;
      }
    });
  }

  function currentMeetingTable(meetings) {
    const tbody = document
      .getElementById("current-meetings-table")
      .getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; // Clear existing rows

    const now = new Date();
    meetings.forEach((meeting) => {
      const startTime = new Date(meeting.start_time);
      const endTime = new Date(startTime.getTime() + meeting.duration * 60000);;
      if (startTime < now && endTime > now) {
        const row = tbody.insertRow();
        row.insertCell(0).innerText = meeting.topic;
        row.insertCell(1).innerText = startTime.toLocaleString();
        row.insertCell(2).innerText = meeting.duration;
        row.insertCell(
          3
        ).innerHTML = `<button onclick="manageMeeting('${meeting.id}')">Quản lý</button>`;
        row.insertCell(
          4
        ).innerHTML = `<button onclick="joinMeeting('${meeting.id}')">Tham gia</button>`;
      }
    });
  }

  fetchUpcomingMeetings();
});

function manageMeeting(meetingId) {
  alert(`Quản lý cuộc họp: ${meetingId}`);
  // Add your management logic here
}

function joinMeeting(meetingId) {
  alert(`Tham gia cuộc họp: ${meetingId}`);
  // Add your join logic here
}
