import axios from 'axios';  
export default {
    name: 'gpt',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
        await ctx.react(ctx.id, '⏳')
        try {
    
            await axios({
                method: 'POST',
                url: 'https://chateverywhere.app/api/chat/',
                data: {
                    "model": {
                        "id": "gpt-4",
                        "name": "GPT-4o",
                        "maxLength": 32000,
                        "tokenLimit": 8000,
                        "completionTokenLimit": 5000,
                        "deploymentName": "gpt-4o"
                    },
                    "messages": [
                        {
                            "pluginId": null,
                            "content": data,
                            "role": "user"
                        }
                    ],
                    "prompt": 'nama mu adalah robot asisten, kamu adalah asisten kecerdasan buatan yang sering membantu orang lain jika ada yang ditanyakan',
                    "temperature": 0.5
                },
                headers: {
                    "Accept": "/*/",
                    "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
                }
            }).then(async (response) => {
                const result = response.data;
                await ctx.reply({ text: result }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '✅')
    
            }).catch(async (err) => {
                await ctx.react(ctx.id, '⛔')
                await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            })
    
    
        } catch (err) {
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}