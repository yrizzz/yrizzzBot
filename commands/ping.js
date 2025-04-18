module.exports = {
    name: 'ping',
    type: 'command',
    code: async (ctx) => {
        ctx.reply('🏓 pong!', { ephemeralExpiration: ctx._msg?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
    },
};