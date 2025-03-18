// Initialize Google Gemini API
const API_KEY = 'AIzaSyCpt3fVeV_G_X3AnH6FZdVysfg_tbCJy40';

// Get DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Function to add a message to the chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to show loading animation
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('loading');
    loadingDiv.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

// Function to handle the chat
async function handleChat() {
    const userMessage = userInput.value.trim();
    
    if (!userMessage) return;
    
    // Clear input
    userInput.value = '';
    
    // Add user message to chat
    addMessage(userMessage, true);
    
    // Show loading animation
    const loadingDiv = showLoading();
    
    try {
        // Initialize the API for each request
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Get response from Gemini
        const result = await model.generateContent(userMessage);
        const response = await result.response;
        const text = response.text();
        
        // Remove loading animation
        loadingDiv.remove();
        
        // Add bot message to chat
        addMessage(text, false);
    } catch (error) {
        // Remove loading animation
        loadingDiv.remove();
        
        // Add error message
        addMessage("Sorry, I encountered an error: " + error.message, false);
        console.error('Error:', error);
    }
}

// Event listeners
sendButton.addEventListener('click', handleChat);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChat();
    }
});

// Add initial message
addMessage("Hello! I'm Gemini. How can I help you today?", false);