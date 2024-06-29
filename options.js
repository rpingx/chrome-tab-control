document.getElementById('save').addEventListener('click', () => {
    const tabLimit = document.getElementById('tabLimit').value;
    const messageDiv = document.getElementById('message');

    messageDiv.textContent = ''; // Clear previous messages
    messageDiv.className = ''; // Clear previous class

    const validatedTabLimit = validateTabLimit(tabLimit);

    if (validatedTabLimit != tabLimit) {
        messageDiv.textContent = 'Please enter a valid positive number.';
        messageDiv.className = 'error';
        return;
    }

    chrome.storage.sync.set({ tabLimit: validatedTabLimit }, () => {
        messageDiv.textContent = 'New tab limit saved!';
        messageDiv.className = 'message';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get('tabLimit', (data) => {
        document.getElementById('tabLimit').value = validateTabLimit(data.tabLimit);
    });
});
