import { Client, CommandHandler } from '@mengkodingan/ckptw';
import path from 'path';
import handler from './handler/global.js';
import event from './handler/event.js';
import fs from 'fs';
import List from 'prompt-list';
import { DB } from './config/database.js';
await DB.setUp();



async function start() {
    await DB.DropDB();
    const bot = new Client({
        readIncommingMsg: handler.base.readIncommingMsg,
        WAVersion: handler.base.WAVersion,
        autoMention: handler.base.autoMention,
        markOnlineOnConnect: handler.base.alwaysOnline,
        phoneNumber: handler.bot.phoneNumber,
        prefix: handler.bot.prefix,
        readIncommingMsg: handler.base.autoRead,
        printQRInTerminal: !handler.base.usePairingCode,
        selfReply: handler.base.selfReply,
        usePairingCode: handler.base.usePairingCode
    });
    const Setup = await DB.Setup();
    await Setup.create({
        selfmode: handler.bot.selfmode
    });

    event(bot);
    
    const cmd = new CommandHandler(bot, path.resolve() + '/commands');
    cmd.load(false);
    bot.launch();
}

export default function main() {
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
        })
        promptList.run()
            .then(async (answer) => {
                if (answer.match('Pairing Code')) {
                    if (!handler.base.phoneNumber) {
                        print('you must add ' + chalk.red('phoneNumber & set usePairingCode to true') + ' at ./handler/global.js');
                        return;
                    }
                    start();
                } else {
                    start();
                }
            });
    }

}