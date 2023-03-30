const TelegramBot = require('node-telegram-bot-api');

const dotenv = require('dotenv');
dotenv.config();

const openaiChat = require('./content/chat');
const openaiChatJailBreak = require('./content/chatJB');
const openaiImage = require('./content/image');

// Replace YOUR_TELEGRAM_BOT_TOKEN with the token you received from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// Set bot commands
bot.setMyCommands([
    { command: 'i', description: 'Get a sample image' },
    { command: 'c', description: 'Chat with the bot' },
    { command: 'cj', description: 'Enter chat jailbreak mode' },
]);


// Listen for any message
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // Check if the message is a command
    if (msg.text.startsWith('/')) {
        handleCommand(msg);
    } else {
        bot.sendMessage(chatId, 'Use the command available');
        if (msg.reply_to_message) {
            const quotedMsg = msg.reply_to_message;
            console.log(`User quoted: "${quotedMsg.text}"`);
          }
        
    }
});

// Handle commands
async function handleCommand(msg) {
    const chatId = msg.chat.id;
    const commandParts = msg.text.split(' ');
    const command = commandParts[0].toLowerCase();

    // Get the text after the command (if any)
    const commandText = commandParts.slice(1).join(' ').trim();
    console.log("[From] " + chatId)
    console.log("[CommandText] " + commandText)
    if (commandText === "") {
        bot.sendMessage(chatId, 'Usage: ' + command + ' <text>');
        return;
    }
    let response = ""

    switch (command) {
        case '/i':
            response = await openaiImage(commandText);
            if (response.includes("https://")) {
                bot.sendPhoto(chatId, response, { caption: commandText });
            } else {
                bot.sendMessage(chatId, response);
            }
            break;
        case '/c':
            response = await openaiChat(commandText);
            bot.sendMessage(chatId, response);
            break;
        case '/cj':
            response = await openaiChatJailBreak(commandText);
            bot.sendMessage(chatId, response);
            break;
        default:
            bot.sendMessage(chatId, 'Unknown command: ' + command);
    }

    console.log('[response] ' + response + "\n")
}