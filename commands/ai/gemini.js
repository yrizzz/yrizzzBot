const req = require('../../handler/req.js');
const helper = require('../../handler/helper.js');

module.exports = {
    name: 'gemini',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳');
        try {
            data = helper.filtermessage(m, data);

            const result = await req('GET', `https://yrizzz.my.id/api/v1/ai/geminiAi?prompt=${data}`);
            if (result.status) {
                await ctx.reply({ text: result.data }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '✅');
            }

        } catch (err) {
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};