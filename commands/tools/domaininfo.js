import axios from 'axios'
import dateFormat, { masks } from "dateformat";

export default {
    name: 'domaininfo',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
        await ctx.react(ctx.id, '⏳')
        try {
            let dateDiff = (date) => {

                date = date.split('-');
                var today = new Date();
                var year = today.getFullYear();
                var month = today.getMonth() + 1;
                var day = today.getDate();
                var yy = parseInt(date[0]);
                var mm = parseInt(date[1]);
                var dd = parseInt(date[2]);
                var years, months, days;

                months = month - mm;
                if (day < dd) {
                    months = months - 1;
                }

                years = year - yy;
                if (month * 100 + day < mm * 100 + dd) {
                    years = years - 1;
                    months = months + 12;
                }

                days = Math.floor((today.getTime() - (new Date(yy + years, mm + months - 1, dd)).getTime()) / (24 * 60 * 60 * 1000));

                return {
                    years: years,
                    months: months,
                    days: days
                };

            }
            
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

            link = link.replace('.domaininfo ', '');

            link = link.match(regex)[0];
            link = link.replace('https://', '').replace('http://', '').replace('www.', '')
            axios({
                url: 'https://api.dmns.app/domain/' + link + '?mode=detailed',
                headers: {
                    'Authority': 'api.dmns.app',
                    'Method': 'GET',
                    'Path': '/domain/google.com/dns-records',
                    'Scheme': 'https',
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache',
                    'Origin': 'https://dmns.app',
                    'Pragma': 'no-cache',
                    'Referer': 'https://dmns.app/',
                    'Sec-Ch-Ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                    'Sec-Ch-Ua-Mobile': '?1',
                    'Sec-Ch-Ua-Platform': '"Android"',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-site',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36'
                }
            }).then(async (response) => {
                let rplyMessage
                let result = response.data;
                dateDiff = dateDiff(result?.dates?.created);
                rplyMessage = `🔰${result.domain}🔰 \n\nRegistrar\nurl:${result?.registrar?.url ?? '-'}\nname:${result?.registrar?.name ?? '-'}\nwhois:${result?.registrar?.whois ?? '-'}\n\nage : ${dateDiff?.years ?? '-'} years ${dateDiff?.months ?? '-'} months ${dateDiff?.days ?? '-'} days \ncreated : ${dateFormat(result?.dates?.created, 'dd mmmm yyyy h:MM:ss TT')}\nupdated : ${dateFormat(result?.dates?.updated, 'dd mmmm yyyy h:MM:ss TT')}\nexpired : ${dateFormat(result?.dates?.expiry, 'dd mmmm yyyy h:MM:ss TT')} (${result?.dates?.expiryDays} Days)`

                await ctx.reply({ text: rplyMessage }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '✅')
            });

        } catch (err) {
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}