const req = require('../../handler/req.js');
const helper = require('../../handler/helper.js');

module.exports = {
	name: 'ttprofile',
	type: 'command',
	code: async (ctx) => {
		let m = ctx._msg;
		let command = m.content.split(' ')[0];
		let data = m.content.slice(command.length + 1);
		await ctx.react(ctx.id, '⏳');
		try {
			console.log(data);
			data = helper.filtermessage(m, data);
			console.log(data);

			const result = await req('GET', `https://yrizzz.my.id/api/v1/socialmedia/ttprofile?username=${data}`);

			if (result.status) {
				let caption = '';
				caption += 'Nickname : ' + result.data.userInfo.user.nickname + '\n';
				caption += 'Username : ' + data + '\n';
				caption += 'Follower : ' + result.data.userInfo.stats.followerCount + '\n';
				caption += 'Following : ' + result.data.userInfo.stats.followingCount + '\n';
				caption += 'Total video : ' + result.data.userInfo.stats.videoCount;

				await ctx.reply({ image: { url: result.data.userInfo.user.avatarLarger }, caption: caption }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
				await ctx.react(ctx.id, '✅');
			}

		} catch (err) {
			console.log(err);
			await ctx.react(ctx.id, '⛔');
			await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
		}
	}
};
