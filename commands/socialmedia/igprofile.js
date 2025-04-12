import req from '../../handler/req.js'
import helper from '../../handler/helper.js'
export default {
    name: 'igprofile',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let command = m.content.split(' ')[0];
        let data = m.content.slice(command.length+1);
        await ctx.react(ctx.id, '⏳')
        try {
            console.log(data);
            data = helper.filtermessage(m, data);
            console.log(data);
            

            const result = await req('GET', `https://yrizzz.my.id/api/v1/socialmedia/igprofile?username=${data}`)

            if (result.status) {
                let caption = '';
                caption += 'Fullname : ' + result.data.full_name+'\n';
                caption += 'Username : ' + result.data.username+'\n';
                caption += 'Biography : ' + result.data.biography+'\n';
                caption += 'Follower : ' + result.data.follower_count+'\n';
                caption += 'Following : ' + result.data.following_count+'\n';
                caption += 'Total post : ' + result.data.media_count;


                await ctx.reply({ image: { url: result.data.hd_profile_pic_url_info.url }, caption: caption }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '✅')
            }

        } catch (err) {
            console.log(err);
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}