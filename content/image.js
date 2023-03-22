// openai.js
const fetch = require('cross-fetch');

const dotenv = require('dotenv');
dotenv.config();

async function openaiImage(inputText) {
    const apiUrl = 'https://api.openai.com/v1/images/generations';
    const prompt = inputText;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ prompt }),
    });

    console.log(JSON.stringify({ prompt }))

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        const outputMessage = data.data[0].url;
        return outputMessage;
    } else {
        throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }
}

module.exports = openaiImage;
