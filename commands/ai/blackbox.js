import req from '../../handler/req.js'
import helper from '../../handler/helper.js'
export default {
    name: 'blackbox',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length+1);
        await ctx.react(ctx.id, '⏳')
        try {
            data = helper.filtermessage(m, data);

            const result = await req('GET', `https://yrizzz.my.id/api/v1/ai/blackboxAi?prompt=${data}`)
            if (result.status) {
                await ctx.reply({ text: result.data }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '✅')
            }

        } catch (err) {
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}