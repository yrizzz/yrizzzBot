const { MessageType } = require("@mengkodingan/ckptw");
const { Sticker, StickerTypes } = require('wa-sticker-formatter')
const fs = require('fs')
module.exports = {
    name: 'sticker',
    aliases: ["sticker","s"],
    command: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳');
        try {
            let image;
            try {
                if (ctx.getMessageType() === MessageType.extendedTextMessage) {
                    image = await ctx.quoted.media.toBuffer()
                } else if (ctx.getMessageType() === MessageType.imageMessage) {
                    image = await ctx.msg.media.toBuffer()
                } else {
                    return false;
                }
            } catch (err) {
                await ctx.reply({ text: 'media not found' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '⛔');
            }

            fs.writeFileSync('./tmp-s.jpeg', image);
            const sticker = new Sticker('./tmp-s.jpeg', {
                pack: 'My Pack', // The pack name
                author: 'Yrizzz', // The author name
                type: 'full', // The sticker type
                categories: [ '🎉'], // The sticker category
                id: ctx.id, // The sticker id
                quality: 50, // The quality of the output file
                background: '#000000' // The sticker background color (only for full stickers)
            })
            let msg = await sticker.toMessage()
            console.log(msg)
            await ctx.reply( msg , { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅');
            fs.unlink('./tmp-s.jpeg', (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('File is deleted.');
                }
            });
        } catch (err) {
            console.log(err)
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};
