const { monospace, italic, quote } = require('@mengkodingan/ckptw');

const handler = {
    bot: {
        prefix: '/[^.#!~]/i',
        thumbnail: '',
        website: '',
        group: '',
        selfmode: true
    },
    base: {
        readIncommingMsg: false, // Should bot mark as read the incomming messages? - Default: false
        authDir: '', // Path to the auth/creds directory - Default: ./state
        printQRInTerminal: true, // Print the qr in terminal? - Default: false
        qrTimeout: 60000, // Time taken to generate new qr in ms - Default: 60000 ms (1 minute)
        markOnlineOnConnect: false, // Should the client mark as online on connect? - Default: true
        phoneNumber: '6281296451923', // The bot phone number starts with country code (e.g 62xxx), Used for pairing code purposes.
        usePairingCode: false, // Connect the bot using pairing code method instead of qr method. - Default: false
        selfReply: true, // Should a bot reply when the bot number itself uses its bot command? - Default: false
        WAVersion: [2, 3000, 1019104852], // Optional specify a custom Whatsapp Web Version
        autoMention: true, // You can mention someone without having to enter each Whatsapp Jid into the `mentions` array. - Default: false
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
};

module.exports = handler;