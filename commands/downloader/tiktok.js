const req = require('../../handler/req.js');
const helper = require('../../handler/helper.js');

module.exports = {
	name: 'tt',
	type: 'command',
	code: async (ctx) => {
		let m = ctx._msg;
		let command = m.content.split(' ')[0];
		let data = m.content.slice(command.length + 1);
		await ctx.react(ctx.id, '⏳');
		try {
			data = helper.filtermessage(m, data);
			const result = await req('GET', `https://yrizzz.my.id/api/v1/downloader/tiktok?data=${data}`);

			if (result.status) {

				await ctx.reply({ video: { url: result.data.withOutWtrmk }, caption: '✅ Success' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
				await ctx.react(ctx.id, '✅');
			}

		} catch (err) {
			console.log(err);
			await ctx.react(ctx.id, '⛔');
			await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
		}
	}
};
