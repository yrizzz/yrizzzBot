const pkg = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent,jidDecode,getDevice } = pkg
const { Events, quote } = require('@mengkodingan/ckptw');
const { createCanvas, loadImage } = require('canvas');
const kleur = require('kleur');
const moment = require('moment');
const { DB } = require('../config/database.js');
const { get } = require("http");


let Setup, Owner;

(async () => {
    await DB.start();
    Setup = await DB.Setup();
    Owner = await DB.Owner();
})();

const groupUserEvent = async (bot, m) => {
    try {
        const { id, author, participants, action } = m;
        const jid = participants[0];
        const groupMetadata = await bot.core.groupMetadata(id);
        const profilePictureUrl = await bot.core
            .profilePictureUrl(jid, 'image')
            .catch(
                () =>
                    'https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg'
            );
        print(groupMetadata, profilePictureUrl);
        const canvas = createCanvas(300, 100);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let greeting, capt;
        if (action == 'add') {
            greeting = 'Selamat datang 👋';
            capt = quote('Peraturan grup:\n' + groupMetadata.desc);
        } else {
            greeting = 'Sampai jumpa 👋';
            capt = '';
        }

        ctx.font = 'bold 13px verdana, sans-serif ';
        var welcomeMessage = greeting;
        ctx.textAlign = 'start';
        ctx.fillStyle = 'black';
        ctx.fillText(welcomeMessage, 100, 30);
        ctx.font = '13px verdana, sans-serif ';
        ctx.textAlign = 'start';
        ctx.fillStyle = 'black';
        ctx.fillText('@' + groupMetadata.subject, 100, 50);
        ctx.textAlign = 'start';
        ctx.fillStyle = 'black';
        ctx.fillText(jid.split('@')[0], 100, 70);

        await loadImage(profilePictureUrl).then((image) => {
            ctx.drawImage(image, 15, 15, 70, 70);
        });

        bot.core.sendMessage(
            id,
            {
                image: canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE }),
                caption: capt,
                mentions: [jid]
            },
            { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 }
        );
    } catch (e) {
        console.error(`[${config.pkg.name}] Error:`, error);
        await bot.core.sendMessage(id, {
            text: quote(`⚠️ Terjadi kesalahan: ${error.message}`, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 }),
        });
    }
};

const messagesHandler = async (ctx) => {

    const allowPublicCommand = ['mention'];

    const m = ctx._msg;
    const isGroup = ctx.isGroup();
    const sender = isGroup ? m.key.participant : m.key.remoteJid;

    // console.log(await jidDecode(sender),await getDevice(m.id));

    const isOwner = m.key.fromMe;
    const messageType = ctx.getMessageType();
    const message = m.content;
    const groupId = m.key.remoteJid;
    const setupBot = await Setup.findOne();

    let cmd = message?.split(' ');
    if (cmd) {
        if (cmd.length > 0) {
            cmd = cmd[0].slice(1)
        }
    }

    print(
        `[${kleur.green(
            moment.unix(m.messageTimestamp).format('DD/MM/YYYY HH:mm:ss')
        )}]\nFrom : ${sender}\nType : ${messageType}\nMessage : ${message}\n`
    );


    if (await setupBot.selfmode === true && !isOwner && !allowPublicCommand.includes(cmd)) return false;

    if (isOwner && message) {
        let res;
        try {
            if (message.startsWith('>>')) {
                const code = m.content.slice(message.startsWith('>> ') ? 3 : 2);
                const key = code.split(' ')[0].toLowerCase();
                const value = code.split(' ')[1].toLowerCase();
                const schemaKeys = Object.keys(Setup.schema.paths);
                if (!schemaKeys.includes(key)) {
                    ctx.reply(`Invalid key: ${key}\n *List available* : ${JSON.stringify(schemaKeys, null, 2)}`, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                    return;
                }
                const updateData = { [key]: value };
                const res = await Setup.findOneAndUpdate({}, updateData);
                ctx.reply(`*✅ Executed : ${key} to ${value}*`, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            }

            if (message.startsWith('=>')) {
                let Models;
                const code = m.content.slice(message.startsWith('=> ') ? 3 : 2);
                const split = code.split(' ');
                const model = String(split[0].toLowerCase().charAt(0).toUpperCase()) + String(split[0]).slice(1);
                const command = split[1]?.toLowerCase() ?? '';
                const value = split[2]?.toLowerCase() ?? '';

                switch (command) {
                    case 'update':
                        Models = await eval(`DB.${model}()`);
                        res = await Models.findOneAndUpdate({}, JSON.parse(value));
                        break;
                    case 'show':
                        Models = await eval(`DB.${model}()`);
                        res = await Models.find();
                        break;
                }
                ctx.reply(JSON.stringify(res, null, 2), { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            }
        } catch (err) {
            console.log(err);
            ctx.reply('invalid command,please check your command', { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};

const event = async (bot) => {
    bot.ev.once(Events.ClientReady, async (m) => {
        print(`connected at ${m.user.id}`);
        await Owner.create({ 'id': m.user.id, 'name': m.user.name });
    });

    bot.ev.on(Events.MessagesUpsert, async (m, ctx) => {
        messagesHandler(ctx, m);
    });

    bot.command('iseng', async (ctx) => {
        const m = ctx._msg;
        const data = m.content.slice(7)
        if (m.key.fromMe == true) {
            let target, caption, rply;

            if ((/|/).test(data)) {
                target = data.split('|')[0];
                caption = data.split('|')[1];
                rply = data.split('|')[2];
            }
            ctx.deleteMessage(m.key);
            let msg = generateWAMessageFromContent(target + '@s.whatsapp.net', {
                extendedTextMessage: {
                    text: caption
                }
            }, {})

            msg = JSON.stringify(msg).replace('"fromMe":true', '"fromMe":false');
            msg = JSON.parse(msg);
            if (await ctx.isGroup) {
                const members = await ctx?.group()?.members() ?? null;
                const ids = members.map(member => member.id);
                await ctx.sendMessage(ctx.id, { text: rply }, { quoted: msg, ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0, mentions: ids.length > 0 ? ids : [] });
            } else {
                await ctx.sendMessage(ctx.id, { text: rply }, { quoted: msg, ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            }
        }

    });


    bot.command('mention', async (ctx) => {
        const m = await ctx._msg;
        const isAdmin = await ctx.group().isAdmin(m.key.participant);
        console.log(isAdmin, m)

        if (isAdmin) {
            const members = await ctx.group().members()
            const ids = members.map(member => member.id);

            ctx.reply({ text: m.content.slice(9), mentions: ids }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 })
        }
    });


    bot.ev.on(Events.UserJoin, async (m) => groupUserEvent(bot, m));
    bot.ev.on(Events.UserLeave, async (m) => groupUserEvent(bot, m));
};

module.exports = { event, messagesHandler };
