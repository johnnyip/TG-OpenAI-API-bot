const TelegramBot = require('node-telegram-bot-api');

const dotenv = require('dotenv');
dotenv.config();

const openaiChat = require('./content/chat');
const openaiChat_GPT4 = require('./content/chat_GPT4');
const openaiChatJailBreak = require('./content/chatJB');
const openaiImage = require('./content/image');

// Replace YOUR_TELEGRAM_BOT_TOKEN with the token you received from BotFather
const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, { polling: true });

// Set bot commands
bot.setMyCommands([
    { command: 'i', description: 'Get a sample image' },
    { command: 'c', description: 'Chat with the bot' },
    { command: 'c4', description: 'Chat with the GPT-4 bot' },
    { command: 'cj', description: 'Enter chat jailbreak mode (GPT-3.5)' },
]);


// Listen for any message
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    console.log(chatId);

    // Check if the message is a command
    if (msg.text.startsWith('/')) {
        handleCommand(msg);
    } else {
        bot.sendMessage(chatId, 'Use the command available', { reply_to_message_id: msg.message_id });
        if (msg.reply_to_message) {
            // console.log(msg.reply_to_message)
            // console.log(msg)
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
    let quotedMsg = "";

    if (msg.reply_to_message) {
        console.log(msg.reply_to_message)
        quotedMsg = msg.reply_to_message.text
    }


    switch (command) {
        case '/i':
            response = await openaiImage(commandText);
            if (response.includes("https://")) {
                bot.sendPhoto(chatId, response, {
                    caption: commandText,
                    reply_to_message_id: msg.message_id
                });
            } else {
                bot.sendMessage(chatId, response, { reply_to_message_id: msg.message_id });
            }
            break;
        case '/c':
            response = await openaiChat(commandText, quotedMsg);
            bot.sendMessage(chatId, response, { reply_to_message_id: msg.message_id });
            break;
        case '/c4':
            response = await openaiChat_GPT4(commandText, quotedMsg);
            bot.sendMessage(chatId, response, { reply_to_message_id: msg.message_id });
            break;
        case '/cj':
            response = await openaiChatJailBreak(commandText, quotedMsg);
            bot.sendMessage(chatId, response, { reply_to_message_id: msg.message_id });
            break;
        default:
            bot.sendMessage(chatId, 'Unknown command: ' + command, { reply_to_message_id: msg.message_id });
    }

    console.log('[response] ' + response + "\n")
}