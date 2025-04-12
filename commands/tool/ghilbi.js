import { MessageType } from "@mengkodingan/ckptw";
import req from '../../handler/req.js'
export default {
    name: 'ghilbi',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length + 1);
        await ctx.react(ctx.id, '⏳')
        try {
            let buffer;
            try {
                if (ctx.getMessageType() === MessageType.extendedTextMessage) {
                    buffer = await ctx.quoted.media.toBuffer();
                } else if (ctx.getMessageType() === MessageType.imageMessage) {
                    buffer = await ctx.msg.media.toBuffer();
                } else {
                    return false;
                }
            } catch (err) {
                await ctx.reply({ text: 'image not found' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '⛔')
            }

            let formdata = new FormData();
            formdata.append('strength', '0.55');
            formdata.append('image', new Blob([buffer])); //this image from wa as buffer

            const ghilbi = await req('POST', `https://api.remaker.ai/api/pai/v4/ai-toanime/appapi/create-job`, formdata, {
                'product-code': '067003',
                'product-serial': '902bc342e4cf8562b3bc4507c79dc03b',
                'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
            })
            console.log(ghilbi)

            let ghilbiStat = 'process';
            let resultGhilbi;

            do {
                const ghilbiGet = await req('GET', 'https://api.remaker.ai/api/pai/v3/ai-toanime/appapi/get-job/' + ghilbi.result.job_id);
                if (ghilbiGet.code == '100000') {
                    ghilbiStat = 'done';
                    resultGhilbi = ghilbiGet.result.output_image_url;
                }
            } while (ghilbiStat == 'process')

            await ctx.reply({ image: { url: resultGhilbi }, caption: 'Success ✅' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅')


        } catch (err) {
            console.log(err)
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }


}

