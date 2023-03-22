// openai.js
const fetch = require('cross-fetch');

async function openaiChat(inputText) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const model = 'gpt-3.5-turbo';
    const messages = [{ role: 'user', content: inputText }];

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model, messages }),
    });

    if (response.ok) {
        const data = await response.json();
        const outputMessage = data.choices[0].message.content;
        return outputMessage;
    } else {
        throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }
}

module.exports = openaiChat;
