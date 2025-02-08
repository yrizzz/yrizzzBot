import { MessageType, bold, inlineCode, italic, monospace, quote, strikethrough } from "@mengkodingan/ckptw";
import Jimp from 'jimp';
import axios from 'axios';

export default {
    name: 'hd',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
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

            let anime = false, upscale = 2;
            data = !data ? '2' : data;

            if ((/:/).test(data)) {
                let split = data.split(':');
                if (split.length > 1) {
                    if (!['2', '4', '6', '8', '16', '32'].includes(split[0])) {
                        await ctx.reply('size 2/4/6/8/16/32');
                        await ctx.react(ctx.id, '⛔')
                        return;
                    } else {
                        upscale = split[0];
                        anime = split[1] == 'anime' ? true : false;
                    }
                } else {
                    await ctx.reply('invalid format');
                    await ctx.react(ctx.id, '⛔')
                }
            } else {
                if (!['2', '4', '6', '8', '16', '32'].includes(data)) {
                    await ctx.reply('size 2/4/6/8/16/32');
                    await ctx.react(ctx.id, '⛔')
                    return;
                } else {
                    upscale = data ?? 2;
                }
            }
            Jimp.read(Buffer.from(buffer)).then(async image => {
                const { width, height } = image.bitmap;
                let newWidth = width * upscale;
                let newHeight = height * upscale;
                const form = new FormData();
                form.append("name", "upscale-" + Date.now())
                form.append("imageName", "upscale-" + Date.now())
                form.append("desiredHeight", newHeight.toString())
                form.append("desiredWidth", newWidth.toString())
                form.append("outputFormat", "png")
                form.append("compressionLevel", "none")
                form.append("anime", anime)
                form.append("image_file", new Blob([buffer], { type: 'image/png' }), {
                    filename: "upscale-" + Date.now() + ".png",
                    contentType: 'image/png',
                })
                axios.post("https://api.upscalepics.com/upscale-to-size", form, {
                    headers: {
                        ...form.getHeaders?.() ?? { 'Content-Type': 'multipart/form-data' },
                        origin: "https://upscalepics.com",
                        referer: "https://upscalepics.com"
                    }
                }).then(async res => {
                    const data = res.data;
                    if (data.error) {
                        await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                        await ctx.react(ctx.id, '⛔')
                    } else {
                        await ctx.reply({ image: { url: data.bgRemoved }, caption: 'Success ✅\n\n' +'Tersedia ukuran 2, 4, 6, 8, 16, 32 defaultnya adalah 2. Gunakan anime jika gambarnya anime'+'\n\n'+quote('Contoh: .hd 8:anime') }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                        await ctx.react(ctx.id, '✅')
                    }
                }).catch(async (err) => {
                    await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                    await ctx.react(ctx.id, '⛔')
                })
            });

        } catch (err) {
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ rext: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }


    },
}