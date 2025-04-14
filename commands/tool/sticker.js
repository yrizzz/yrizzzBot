const { MessageType } = require("@mengkodingan/ckptw");
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')

module.exports = {
    name: 'sticker',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳');
        try {
            let image;
            try {
                if (ctx.getMessageType() === MessageType.extendedTextMessage) {
                    image = await ctx.quoted.media
                } else if (ctx.getMessageType() === MessageType.imageMessage) {
                    image = await ctx.msg.media
                } else {
                    return false;
                }
            } catch (err) {
                await ctx.reply({ text: 'media not found' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '⛔');
            }

            const buffer = await new Sticker(image)
                .setPack('My Sticker')
                .setAuthor('Yrizzz')
                .setType(StickerTypes.DEFAULT)
                .setCategories(['🤩', '🎉'])
                .setId('12345')
                .setBackground('#000000')
                .setQuality(100)
                .toBuffer()

            await ctx.reply({ sticker: buffer }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅');

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};
