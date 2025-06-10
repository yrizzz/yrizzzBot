const req = require('../../handler/req.js');
module.exports = {
    name: 'who',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        if (!m) return;
        const meta = m?.key.remoteJid?.endsWith('g.us') ? await bot.core.groupMetadata(m?.key.remoteJid) : null
        const isGroup = await ctx?.isGroup();
        if (isGroup && m.key.participant?.endsWith('lid')) {
            const lid = meta?.participants?.find(p => p?.id === m.key.participant)
            m.key.participant = typeof lid?.jid !== 'undefined' ? lid.jid : m.key.participant;
            let botId = bot.core.user.id.replace(/:\d+(@)/, "$1");
            isOwner = botId == m.key.participant ? true : false;
        }
        let sender = isGroup ? m.key.participant : m?.key.remoteJid;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳');
        try {
            sender = data == '' ?? sender
            const result = await req('POST', `https://yrizzz.my.id/api/v1/tool/phoneChecker?phone=${sender}`);
            await ctx.reply({ text: result.data }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅');

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};
