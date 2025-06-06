const { MessageType } = require("@mengkodingan/ckptw");
const req = require('../../handler/req.js');
const FormData = require('form-data');
const Blob = require('buffer').Blob;

module.exports = {
    name: 'rmbg',
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
            formdata.append('image', buffer, { filename: 'image.jpg' }); // Use buffer directly with a filename


            const result = await req('POST', `https://yrizzz.my.id/api/v1/tool/removeBg`, formdata);

            buffer = Buffer.from(result.data, 'base64');

            await ctx.reply({ image: buffer, caption: 'Success ✅' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅');

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};
