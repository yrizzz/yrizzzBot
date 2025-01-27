import { GoogleGenerativeAI } from '@google/generative-ai';
export default {
    name: 'gemini',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
        await ctx.react(ctx.id, '⏳')
        try {
            const genAI = new GoogleGenerativeAI('AIzaSyDwvysD0Ep47MvQ0WLC0gbuMPIMWbiRMHE');

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            const result = await model.generateContent(data ?? 'hai');
            const response = await result.response;
            let text = response.text().replaceAll('**', '*');
            text = text.replaceAll('* *', '*')

            await ctx.reply({ text: text }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅')
        } catch (err) {
            console.log(err)
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}