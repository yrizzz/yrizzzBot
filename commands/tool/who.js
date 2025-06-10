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
            console.log(m.message);
            let s = m?.message?.extendedTextMessage?.contextInfo.participant || data || '';
            if (typeof s === 'string' && s.length > 2) {
                s = '0' + s.substring(2);
                s = s.replace('@s.whatsapp.net', '');
            } else {
                s = '';
            }
            let sender = data ? data : s;
            let result = await req('GET', `https://yrizzz.my.id/api/v1/tool/phoneChecker?phone=${sender}`);
            result = await JSON.stringify(result.data, null, 2);
            await ctx.reply({ text: result }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅');

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};
