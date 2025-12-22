function toggleChat() {
    const chatBox = document.getElementById('chatBox');
    chatBox.classList.toggle('chat-active');
    
    if (chatBox.classList.contains('chat-active')) {
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

async function handleChat() {
    const input = document.getElementById('aiInput');
    const messagesContainer = document.getElementById('chatMessages');
    const userText = input.value.trim();

    if (!userText) return;

    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'user-msg';
    userMsgDiv.textContent = userText;
    messagesContainer.appendChild(userMsgDiv);

    input.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-msg';
    typingDiv.id = 'typing';
    typingDiv.textContent = "Hermoso AI is thinking...";
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userText })
        });

        const data = await response.json();
        
        document.getElementById('typing').remove();

        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'bot-msg';
        botMsgDiv.textContent = data.reply;
        messagesContainer.appendChild(botMsgDiv);

    } catch (error) {
        document.getElementById('typing').remove();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bot-msg';
        errorDiv.style.color = 'red';
        errorDiv.textContent = "Bhai, backend connect nahi ho pa raha. Please check 'server.js'.";
        messagesContainer.appendChild(errorDiv);
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.getElementById('aiInput')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleChat();
    }
});

document.getElementById('orderForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const plan = document.getElementById('plan').value;
    const submitBtn = e.target.querySelector('.btn-submit');

    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert(`Great ${name}! You choose ${plan} plan.Our team will contact you soon.`);
        submitBtn.innerHTML = 'Send Inquiry <i class="fas fa-paper-plane"></i>';
        submitBtn.disabled = false;
        this.reset();
    }, 2000);
});

window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
    } else {
        nav.style.boxShadow = 'none';
    }
});

async function handleChat() {
    const input = document.getElementById('aiInput');
    const messagesContainer = document.getElementById('chatMessages');
    const userText = input.value.trim();

    if (!userText) return;

    messagesContainer.innerHTML += `<div class="user-msg">${userText}</div>`;
    input.value = "";

    const typingId = "typing-" + Date.now(); // Unique ID
    messagesContainer.innerHTML += `<div class="bot-msg" id="${typingId}">Hermoso AI is thinking...</div>`;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userText })
        });

        const data = await response.json();
        
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.remove();

        messagesContainer.innerHTML += `<div class="bot-msg">${data.reply}</div>`;

    } catch (error) {
        console.error("Connection Error:", error);
        const typingElement = document.getElementById(typingId);
        if (typingElement) typingElement.innerHTML = "Bhai, Backend start kiya kya? Server connect nahi ho raha.";
    }

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

document.getElementById('aiInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChat();
});



