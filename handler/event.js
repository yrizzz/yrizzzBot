import { quote, Events } from "@mengkodingan/ckptw";
import moment from "moment";
import Jimp from "jimp";
import { createCanvas, loadImage } from "canvas";

const groupUserEvent = async (bot, m) => {
    try {
        const { id, author, participants, action } = m;
        const jid = participants[0];
        const groupMetadata = await bot.core.groupMetadata(id);
        const profilePictureUrl = await bot.core.profilePictureUrl(jid, "image").catch(() => "https://i.pinimg.com/736x/70/dd/61/70dd612c65034b88ebf474a52ccc70c4.jpg");
        print(groupMetadata, profilePictureUrl);

        const canvas = createCanvas(200, 100)
        const ctx = canvas.getContext('2d')

        // Write "Awesome!"
        ctx.fillStyle = "blue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await loadImage(profilePictureUrl).then((image) => {
            ctx.drawImage(image, 50, 0, 70, 70)
        })

        await bot.core.sendMessage(id, {
            image: canvas.toBuffer()
        });

    } catch (e) {
        console.error(`[${config.pkg.name}] Error:`, error);
        await bot.core.sendMessage(id, {
            text: quote(`⚠️ Terjadi kesalahan: ${error.message}`)
        });
    }

}


export default function event(bot) {
    bot.ev.once(Events.ClientReady, (m) => {
        print(`connected at ${m.user.id}`);
    });

    bot.ev.on(Events.MessagesUpsert, (m, ctx) => {
        const messageType = ctx.getMessageType();
        const message = m.content;
        const sender = m.key.remoteJid;
        if (m.key.fromMe) return;
        print(`[${chalk.green(moment.unix(m.messageTimestamp).format('DD/MM/YYYY HH:mm:ss'))}]\nFrom : ${sender}\nType : ${messageType}\nMessage : ${message}\n`);
    })

    bot.ev.on(Events.UserJoin, async (m) => groupUserEvent(bot, m));
    bot.ev.on(Events.UserLeave, async (m) => groupUserEvent(bot, m));

}