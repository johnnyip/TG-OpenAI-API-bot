// openai.js
const fetch = require('cross-fetch');

const dotenv = require('dotenv');
dotenv.config();

async function openaiChat(inputText, quotedMsg) {
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const model = 'gpt-4';
    const messages = [
        { role: "assistant", content: quotedMsg },
        { role: 'user', content: inputText }
    ];


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
        const outputMessage = data.choices[0].message.content + "\n(token: " + data.usage.total_tokens + ")";
        return outputMessage;
    } else {
        return (`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }
}

module.exports = openaiChat;
