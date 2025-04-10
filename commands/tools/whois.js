import req from '../../handler/req.js'

export default {
    name: 'whois',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
        await ctx.react(ctx.id, '⏳')
        try {

            const regex = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.?[a-zA-Z0-9\_\-]{1,})(\.[a-zA-Z0-9]{2,})/g;

            let link;
            if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
                link = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
            } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text) {
                link = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text
            } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption) {
                link = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption;
            } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption) {
                link = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption;
            } else {
                link = data;
            }

            link = link.replace('.whois ', '');

            link = link.match(regex)[0];
            link = link.replace('https://', '').replace('http://', '').replace('www.', '')
            const result = await req('GET', `https://yrizzz.my.id/api/v1/domain/whois?domain=${link}`)
            if (result.status) {
                let rplyMessage = '🌐 Whois : ' + data + '\n';
                console.log(result.data)

                for (let res in result.data) {
                    rplyMessage += '\n'
                    rplyMessage += '🔰 ' + res + '\n'
                    for (let detailRes in result.data[res]) {
                        if (detailRes != 'text') {
                            rplyMessage += detailRes + ' : ' + result.data[res][detailRes] + '\n';
                        }
                    }
                }
                await ctx.reply({ text: rplyMessage }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '✅')
            }

        } catch (err) {
            console.log(err)
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}