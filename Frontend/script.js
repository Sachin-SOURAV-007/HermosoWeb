function scrollToForm() {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
}

document.getElementById("requestForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Request submitted successfully!");
});

function sendMessage() {
  const input = document.getElementById("chatInput");
  const chatBody = document.getElementById("chatBody");

  if (input.value.trim() === "") return;

  chatBody.innerHTML += `<p><b>You:</b> ${input.value}</p>`;
  chatBody.innerHTML += `<p><b>HermosoBot:</b> Thanks for your message! We will assist you shortly.</p>`;

  chatBody.scrollTop = chatBody.scrollHeight;
  input.value = "";
}

document.getElementById("requestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = e.target[0].value;
  const email = e.target[1].value;
  const websiteType = e.target[2].value;

  const response = await fetch("http://localhost:5000/request", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, websiteType }),
  });

  const data = await response.json();
  alert(data.message);
});

