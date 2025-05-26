const req = require('../../handler/req.js');
const helper = require('../../handler/helper.js');
const FormData = require('form-data');

module.exports = {
    name: 'translite',
    aliases: ["tr", "translite"],
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 3);
        await ctx.react(ctx.id, '⏳')
        try {
            data = helper.filtermessage(m, data);
            let to = m.content.split(' ')[1] || 'id'; 

            const result = await req('GET', `https://yrizzz.my.id/api/v1/tool/translate?from=auto&to=${to}&data=${data}`);

            let replyMsg = '';
            replyMsg += '✅ Translated successfully\n';
            replyMsg += `» Detected : *${result.data.detect}*\n`;
            replyMsg += `» To : *${to}*\n\n`;
            replyMsg += '`Result :`\n'
            replyMsg += result.data.translated;

            await ctx.reply({ text: replyMsg }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅')


        } catch (err) {
            console.log(err)
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}
