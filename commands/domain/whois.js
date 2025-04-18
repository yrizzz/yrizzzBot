const req = require('../../handler/req.js');
const helper = require('../../handler/helper.js');

module.exports = {
    name: 'whois',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳');
        try {
            const regex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.?[a-zA-Z0-9\_\-]{1,})(\.[a-zA-Z0-9]{2,})/g;

            data = helper.filtermessage(m, data);

            let link = data.match(regex)[0];
            link = link.replace('https://', '').replace('http://', '').replace('www.', '');
            const result = await req('GET', `https://yrizzz.my.id/api/v1/domain/whois?domain=${link}`);
            if (result.status) {
                let rplyMessage = '🌐 Whois : ' + link + '\n';
                for (let res in result.data) {
                    rplyMessage += '\n';
                    rplyMessage += '🔰 ' + res + '\n';
                    for (let detailRes in result.data[res]) {
                        if (detailRes != 'text') {
                            rplyMessage += detailRes + ' : ' + result.data[res][detailRes] + '\n';
                        }
                    }
                }
                await ctx.reply({ text: rplyMessage }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '✅');
            }

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔');
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
};