import { MessageType, bold, inlineCode, italic, monospace, quote, strikethrough } from "@mengkodingan/ckptw";
import axios from 'axios';
import sharp from 'sharp'

export default {
    name: 'bg',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '').trim();
        await ctx.react(ctx.id, '⏳')
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
                await ctx.react(ctx.id, '⛔')
            }

            let formdata = new FormData();
            formdata.append('image',  new Blob([buffer]));
            formdata.append('format', 'png');
            formdata.append('model', 'v1');


            const removebg = await axios.post('https://api2.pixelcut.app/image/matte/v1', formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundarywLIZ6MslWB8TJ7Ub',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
                    'X-Client-Version': 'Web',
                    ...formdata.getHeaders?.() ?? { 'Content-Type': 'multipart/form-data' },
                },
                responseType: 'arraybuffer'
            });

            const input = new Buffer.from(removebg.data);

            await sharp.cache(false);
            const result = await sharp(input)
                .flatten({ background: data })
                .jpeg({ progressive: true })
                .toBuffer();


            await ctx.reply({ image: result, caption: 'Success ✅' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅')



        } catch (err) {
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }


}

