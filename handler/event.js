import { quote, Events } from '@mengkodingan/ckptw';
import moment from 'moment';
import { createCanvas, loadImage } from 'canvas';

const groupUserEvent = async (bot, m) => {
  try {
    const { id, author, participants, action } = m;
    const jid = participants[0];
    const groupMetadata = await bot.core.groupMetadata(id);
    const profilePictureUrl = await bot.core
      .profilePictureUrl(jid, 'image')
      .catch(
        () =>
          'https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg'
      );
    print(groupMetadata, profilePictureUrl);
    const canvas = createCanvas(300, 100);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let greeting, capt;
    if (action == 'add') {
      greeting = 'Selamat datang 👋';
      capt = quote('Peraturan grup:\n' + groupMetadata.desc)
    } else {
      greeting = 'Sampai jumpa 👋';
      capt = '';
    }

    ctx.font = 'bold 13px verdana, sans-serif ';
    var welcomeMessage = greeting;
    ctx.textAlign = 'start';
    ctx.fillStyle = 'black';
    ctx.fillText(welcomeMessage, 100, 30);
    ctx.font = '13px verdana, sans-serif ';
    ctx.textAlign = 'start';
    ctx.fillStyle = 'black';
    ctx.fillText('@' + groupMetadata.subject, 100, 50);
    ctx.textAlign = 'start';
    ctx.fillStyle = 'black';
    ctx.fillText(jid.split('@')[0], 100, 70);

    await loadImage(profilePictureUrl).then((image) => {
      ctx.drawImage(image, 15, 15, 70, 70);
    });

    bot.core.sendMessage(id, { image: canvas.toBuffer('image/png', { compressionLevel: 3, filters: canvas.PNG_FILTER_NONE }), caption: capt, mentions: [jid], ephemeralExpiration: groupMetadata.ephemeralDuration ?? 0 });
  } catch (e) {
    console.error(`[${config.pkg.name}] Error:`, error);
    await bot.core.sendMessage(id, {
      text: quote(`⚠️ Terjadi kesalahan: ${error.message}`),
    });
  }
};

export default async function event(bot) {
  bot.ev.once(Events.ClientReady, (m) => {
    print(`connected at ${m.user.id}`);
  });

  bot.ev.on(Events.MessagesUpsert, (m, ctx) => {
    const messageType = ctx.getMessageType();
    const message = m.content;
    const sender = m.key.remoteJid;
    if (m.key.fromMe) return;
    print(
      `[${chalk.green(
        moment.unix(m.messageTimestamp).format('DD/MM/YYYY HH:mm:ss')
      )}]\nFrom : ${sender}\nType : ${messageType}\nMessage : ${message}\n`
    );
  });

  bot.ev.on(Events.UserJoin, async (m) => groupUserEvent(bot, m));
  bot.ev.on(Events.UserLeave, async (m) => groupUserEvent(bot, m));
}
