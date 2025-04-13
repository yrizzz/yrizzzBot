const req = require('../../handler/req.js');
const helper = require('../../handler/helper.js');

module.exports = {
	name: 'bang',
	type: 'command',
	code: async (ctx) => {
		let m = ctx._msg;
		let command = m.content.split(' ')[0];
		let data = m.content.slice(command.length + 1);
		await ctx.react(ctx.id,'⏳');
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
				await ctx.reply({ text: 'image not found' },{ ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
				await ctx.react(ctx.id,'⛔');
			}
			data = helper.filtermessage(m, data);

			let formdata = new FormData();
			formdata.append('image',buffer,{ filename: 'image.jpg' }); 
			formdata.append('prompt',data);


			const result = await req('POST',`https://yrizzz.my.id/api/v1/ai/blackboxImageText`,formdata);
			if (result.status) {
				await ctx.reply({ text: result.data },{ ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
				await ctx.react(ctx.id,'✅');
			}

		} catch (err) {
			await ctx.react(ctx.id,'⛔');
			await ctx.reply({ text: 'internal server error' },{ ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
		}
	}
};