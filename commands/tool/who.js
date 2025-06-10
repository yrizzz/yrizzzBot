const req = require('../../handler/req.js');
module.exports = {
    name: 'who',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳');
        try {
            let sender = m?.key?.participant ?? m?.key.remoteJid;
            sender = data ?? sender;
            const result = await req('GET', `https://yrizzz.my.id/api/v1/tool/phoneChecker?phone=${sender}`);
            console.log(result)
            await ctx.reply({ text: JSON.stringify(result.data) }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅');

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};
