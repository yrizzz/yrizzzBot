const axios = require('axios');

module.exports = {
    name: 'shakker',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
        await ctx.react(ctx.id, '⏳');
        try {
            await axios({
                method: 'POST',
                url: 'https://aiimagegenerator.io/api/model/predict-peach',
                data: {
                    'prompt': data,
                    'negativePrompt': '',
                    'key': 'Anime',
                    'width': 512,
                    'height': 768,
                    'quantity': 5,
                    'size': '512x768'
                }
            }).then(async (response) => {
                const result = response.data.data;
                if (result?.safeState != 'RISKY') {
                    const res = await axios.get(result.url, { responseType: 'arraybuffer' });

                    const resBuffer = Buffer.from(res.data, 'utf-8');
                    await ctx.reply({ image: resBuffer, caption: 'Success ✅' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                    await ctx.react(ctx.id, '✅');
                } else {
                    await ctx.react(ctx.id, '⛔');
                    await ctx.reply({ text: 'try again' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                }
            });

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};