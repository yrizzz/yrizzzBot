import { Client } from "@mengkodingan/ckptw";
import handler from "./handler/global.js";
import event from "./handler/event.js";
import fs from 'fs';
import List from 'prompt-list';

function start() {
    const bot = new Client({
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

    event(bot);
    bot.launch();
}

export default function main() {
    if (fs.existsSync("./state/creds.json")) {
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