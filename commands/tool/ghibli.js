const { MessageType } = require("@mengkodingan/ckptw");
const req = require('../../handler/req.js');
const FormData = require('form-data');
const Blob = require('node-blob');

module.exports = {
    name: 'ghibli',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳');
        try {
            let buffer;
            try {
                if (ctx.getMessageType() === MessageType.extendedTextMessage) {
                    buffer = await ctx.quoted.media.toBuffer();
                } else if (ctx.getMessageType() === MessageType.imageMessage) {
                    buffer = await ctx.msg.media.toBuffer();
                } else {
                    return false;
                }
            } catch (err) {
                await ctx.reply({ text: 'image not found' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '⛔');
            }

            let formdata = new FormData();
            formdata.append('file', new Blob([buffer])); // this image from wa as buffer

            const ghibli = await req('POST', `https://api.headshotly.ai/api/engine/free-transform-ghibli`, formdata, {
                'Origin': 'https://headshotly.ai',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
            });

            await ctx.reply({ image: { url: ghibli.generatedImages[0].url }, caption: 'Success ✅' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅');

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};
