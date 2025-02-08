import axios from 'axios';
export default {
    name: 'igprofile',
    type: 'command',
    code: async (ctx) => {
        let data = ctx._msg.content.split(' ')[1] ?? false;
        await ctx.react(ctx.id, '⏳')
        try {

            let param = JSON.stringify({
                'usernameHD': data,
                'captcha': ''
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://tapi.twicsy.com/api/v1/info',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: param
            };

            axios.request(config)
                .then(async (response) => {
                    if (response.status !== 200) return false;
                    let result = response.data;
                    await ctx.reply({ image: { url: result.picture_hd }, caption: `Followers : ${result.followers}\nFollowing : ${result.following}\nTotal post : ${result.post_count}` })
                    await ctx.react(ctx.id, '✅')

                })
                .catch((error) => {
                    return false;
                });

        } catch (err) {
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }


}

