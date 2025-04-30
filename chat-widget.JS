document.addEventListener('DOMContentLoaded', function() {
    // Check if the chat widget already exists to prevent duplicates
    if (document.querySelector('.chat-widget-container')) {
        return;
    }
    
    // Don't create the chat widget on the login page
    if (document.querySelector('.login-page')) {
        return;
    }
    
    // Create chat widget elements
    const chatWidget = document.createElement('div');
    chatWidget.className = 'chat-widget-container';
    
    // Chat button
    const chatButton = document.createElement('div');
    chatButton.className = 'chat-widget-button';
    chatButton.innerHTML = '💬';
    chatButton.setAttribute('aria-label', 'Open chat');
    chatButton.setAttribute('role', 'button');
    
    // Chat panel
    const chatPanel = document.createElement('div');
    chatPanel.className = 'chat-widget-panel';
    
    // Chat header
    const chatHeader = document.createElement('div');
    chatHeader.className = 'chat-widget-header';
    chatHeader.innerHTML = `
        <div class="chat-widget-title">
            <span class="chat-widget-title-icon">🤖</span>
            <span>Quiz Assistant</span>
        </div>
        <button class="chat-widget-close" aria-label="Close chat">&times;</button>
    `;
    
    // Chat messages container
    const chatMessages = document.createElement('div');
    chatMessages.className = 'chat-widget-messages';
    
    // Chat input container
    const chatInputContainer = document.createElement('div');
    chatInputContainer.className = 'chat-widget-input-container';
    chatInputContainer.innerHTML = `
        <input type="text" class="chat-widget-input" placeholder="Type your message...">
        <button class="chat-widget-send" aria-label="Send message">
            <span class="chat-widget-send-icon"></span>
        </button>
    `;
    
    // Assemble the chat panel
    chatPanel.appendChild(chatHeader);
    chatPanel.appendChild(chatMessages);
    chatPanel.appendChild(chatInputContainer);
    
    // Add everything to the chat widget container
    chatWidget.appendChild(chatButton);
    chatWidget.appendChild(chatPanel);
    
    // Add the chat widget to the page
    document.body.appendChild(chatWidget);
    
    // Add the initial welcome message
    addMessage("Hello! 👋 I'm your Quiz Assistant. How can I help you today?", 'bot');
    
    // Event listeners
    chatButton.addEventListener('click', toggleChat);
    chatPanel.querySelector('.chat-widget-close').addEventListener('click', closeChat);
    
    const sendButton = chatInputContainer.querySelector('.chat-widget-send');
    const inputField = chatInputContainer.querySelector('.chat-widget-input');
    
    sendButton.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Functions
    function toggleChat() {
        chatPanel.classList.toggle('active');
        if (chatPanel.classList.contains('active')) {
            inputField.focus();
        }
    }
    
    function closeChat() {
        chatPanel.classList.remove('active');
    }
    
    function sendMessage() {
        const message = inputField.value.trim();
        if (message) {
            addMessage(message, 'user');
            inputField.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Process the message and respond (after a short delay to simulate thinking)
            setTimeout(() => {
                processMessage(message);
            }, 1500);
        }
    }
    
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}-message`;
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chat-typing-indicator';
        typingIndicator.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        return typingIndicator;
    }
    
    function processMessage(message) {
        // Remove typing indicator
        const typingIndicator = document.querySelector('.chat-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
        
        // Simple response logic based on keywords
        message = message.toLowerCase();
        
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            addMessage("Hi there! How can I assist you with quizzes today?", 'bot');
        }
        else if (message.includes('help')) {
            addMessage("I can help you with quiz-related questions! Ask me about quiz topics, difficulty levels, or how to use our platform.", 'bot');
        }
        else if (message.includes('difficult') || message.includes('hard') || message.includes('easy')) {
            addMessage("We have quizzes of various difficulty levels - Easy, Medium, and Hard. You can select the level that matches your expertise!", 'bot');
        }
        else if (message.includes('topic') || message.includes('subject')) {
            addMessage("Our quizzes cover various topics including General Knowledge, Science, History, Cybersecurity, AI, Machine Learning, Data Structures, Web Development, and Programming Languages.", 'bot');
        }
        else if (message.includes('score') || message.includes('result')) {
            addMessage("You can view your quiz scores in the 'My Scores' section from the profile dropdown. It shows your performance history and statistics.", 'bot');
        }
        else if (message.includes('thank')) {
            addMessage("You're welcome! Happy learning with Quiz Master! 😊", 'bot');
        }
        else if (message.includes('bye') || message.includes('goodbye')) {
            addMessage("Goodbye! Feel free to return if you have more questions!", 'bot');
        }
        else {
            addMessage("I'm not sure how to respond to that. Can you ask me about quiz topics, difficulty levels, or how to use our platform?", 'bot');
        }
    }
});
