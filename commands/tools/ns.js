import axios from 'axios'
export default {
    name: 'ns',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
        await ctx.react(ctx.id, '⏳')
        try {

            let rplyMessage;
            await ctx.react(ctx.id, '⏳')
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

            link = link.replace('.ns ', '');

            link = link.match(regex)[0];

            link = link.replace('https://', '').replace('http://', '').replace('www.', '')

            axios({
                method: 'post',
                url: 'https://www.nslookup.io/api/v1/records',
                data: {
                    dnsServer: 'cloudflare',
                    domain: link
                }
            }).then(async (response) => {
                const ns = [];
                response.data.records.ns.response.answer.map((data, key) => {
                    ns.push(data.record.target.slice(0, -1).trim())
                })
                rplyMessage = `Nameserver\n` + ns.join('\n');
                await ctx.reply({ text: rplyMessage }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '✅')
            }).catch(async (err) => {
                await ctx.react(ctx.id, '⛔')
                await ctx.reply({ text: 'domain not found' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            });
        
        } catch (err) {
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}