import { monospace, italic, quote } from '@mengkodingan/ckptw';

global.handler = {
    bot: {
        prefix: '/[^.#!~]/i', 
        thumbnail: '',
        website: '',
        group: '',
    },
    base: {// Array<string> | string | RegExp;
        readIncommingMsg: false, // Should bot mark as read the incomming messages? - Default: false
        authDir: './config', // Path to the auth/creds directory - Default: ./state
        printQRInTerminal: true, //  Print the qr in terminal? - Default: false
        qrTimeout: 60000, // Time taken to generate new qr in ms - Default: 60000 ms (1 minute)
        markOnlineOnConnect: true, // Should the client mark as online on connect? - Default: true
        phoneNumber: '', // The bot phone number starts with country code (e.g 62xxx), Used for pairing code purposes.
        usePairingCode: false, // Connect the bot using pairing code method instead of qr method. - Default: false
        selfReply: true, // Should a bot reply when the bot number itself uses its bot command? - Default: false
        WAVersion: [2, 3000, 1019104852], // Optional specify a custom Whatsapp Web Version
        autoMention: false, //You can mention someone without having to enter each Whatsapp Jid into the `mentions` array. - Default: false
    },
    message: {
        success: {
            miningStart: monospace('✅ mining dimulai'),
        },
        process: {

        },
        error: {

        }
    },
    sticker: {
        packname: '',
        author: '',
    },
}

export default handler