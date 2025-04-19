const req = require('../../handler/req.js');
const helper = require('../../handler/helper.js');
const FormData = require('form-data');

module.exports = {
    name: 'translite',
    aliases: ["tr","translite"],
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳')
        try {
            console.log( m.content )
            data = helper.filtermessage(m, data);

            let formdata = new FormData();
            formdata.append('from', 'auto');
            formdata.append('to', m.content.split(' ')[1]);
            formdata.append('q', data);

            let result = await req('POST', `https://inter.youdao.com/translate`, formdata,{
                headers: {
                    'Content-Type': `multipart/form-data; boundary=----WebKitFormBoundaryGBO2NOB2Ox3iMBMS`,
                }
            })
            result = result.data
            let replyMsg = '';
            replyMsg += '✅ Translated successfully\n';
            replyMsg += `» Detected : *${result.translate.from}*\n`;
            replyMsg += `» To : *${result.translate.to}*\n\n`;
            replyMsg += '`Result :`\n'
            replyMsg += result.translate.tran;

            await ctx.reply({ text: replyMsg }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅')


        } catch (err) {
            console.log(err)
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}
