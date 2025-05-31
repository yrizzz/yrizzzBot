const { Client, CommandHandler } = require('@mengkodingan/ckptw');
const path = require('path');
const kleur = require('kleur');
const handler = require('./handler/setup.js');
const { event, messagesHandler } = require('./handler/event.js');
const fs = require('fs');
const List = require('prompt-list');
const { DB } = require('./config/database.js');

(async () => {
    await DB.start();
})();

async function start() {
    await DB.DropDB();
    const bot = new Client({
        readIncommingMsg: handler.base.readIncommingMsg,
        printQRInTerminal: handler.base.printQRInTerminal,
        WAVersion: handler.base.WAVersion,
        autoMention: handler.base.autoMention,
        markOnlineOnConnect: handler.base.alwaysOnline,
        phoneNumber: handler.base.phoneNumber,
        prefix: handler.bot.prefix,
        selfReply: handler.base.selfReply,
        usePairingCode:handler.base.usePairingCode
    });
    
    const Setup = await DB.Setup();
    await Setup.create({
        selfmode: handler.bot.selfmode
    });
    await event(bot);

    //middleware
    bot.use(async (ctx, next) => {
        const result = await messagesHandler(bot,ctx);
        if (result === false) return;
        await next();
    });

    const cmd = new CommandHandler(bot, path.resolve() + '/commands');
    cmd.load(false);
    bot.launch();
}

function main() {
    if (fs.existsSync('./state/creds.json')) {
        start();
    } else {
        let promptList = new List({
            name: 'bot auth',
            message: 'Please select method to integrate this bot :',
            choices: [
                'QR Code',
                'Pairing Code'
            ]
        });
        promptList.run()
            .then(async (answer) => {
                if (answer.match('Pairing Code')) {
                    if (!handler.base.phoneNumber) {
                        console.log('you must add ' + kleur.red('phoneNumber & set usePairingCode to true') + ' at ./handler/global.js');
                        return;
                    }
                    start();
                } else {
                    start();
                }
            });
    }
}

module.exports = main;