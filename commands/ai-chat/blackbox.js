import axios from 'axios';
import { MessageType } from "@mengkodingan/ckptw";
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import { writeFile } from 'fs/promises'
import FormData from 'form-data'
import fs from 'fs'

function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export default {
    name: 'blackbox',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
        await ctx.react(ctx.id, '⏳')
        let buffer, base64data, prompt, mime, responseDocument, message, isContinue = null, chat_id = randomString(7);
        if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentWithCaptionMessage) {
            prompt = m?.message?.extendedTextMessage?.text;
            let msg = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentWithCaptionMessage?.message?.documentMessage
            mime = msg?.mimetype;
            let caption = msg?.caption;

            const buffer = await downloadMediaMessage(JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo,
                'buffer',
                {},
            )
            await writeFile(caption, buffer)
            let formdata = new FormData();
            formdata.append('fileName', caption);
            formdata.append('userId', 'f3d50a53-02a3-404d-9110-9049f0c40598');
            formdata.append('document', new Blob([buffer]));
            await axios({
                method: 'POST',
                url: 'https://www.blackbox.ai/api/upload',
                data: formdata,
                headers: {
                    'Cookie': 'sessionId=1a5c1f6c-0306-4449-8897-1dfb0d6ff6bd; intercom-id-jlmqxicb=ebb37440-6063-4c72-bc30-ec7eb0868711; intercom-device-id-jlmqxicb=7bcbb970-f2b9-40d9-8574-a03a547b4814; intercom-session-jlmqxicb=; __Host-authjs.csrf-token=bcf0c5236321d10163ae4a7f86242f3942bacc2917b3c58109009830f34208f0%7Ce1764030bd4a38f52f192b2b660ea97ab4aa9efe0b4ef9372f778270ceb6bc17; __Secure-authjs.callback-url=https%3A%2F%2Fwww.blackbox.ai',
                    'Origin': 'https://www.blackbox.ai',
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryhvIdJsqO50HrItsH',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
                    ...formdata.getHeaders()
                },
            }).then(async (response) => {
                responseDocument = response.data.response;
            })
            fs.unlink('./' + caption, (err) => {
                if (err) {
                    console.error(err);
                } else {
                    console.log('File is deleted.');
                }
            });
        } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
            prompt = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
        } else if (m?.message?.imageMessage) {
            if (ctx.getMessageType() === MessageType.extendedTextMessage) {
                buffer = await ctx.quoted.media.toBuffer();
                base64data = await buffer.toString('base64');
            } else if (ctx.getMessageType() === MessageType.imageMessage) {
                buffer = await ctx.msg.media.toBuffer();
                base64data = await buffer.toString('base64');
            }
            mime = m?.message?.imageMessage?.mimetype;
            prompt = m?.message?.imageMessage?.caption;
            prompt = prompt.replace(prompt.split(' ')[0], '');

        } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage) {
            prompt = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text
        } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
            if (ctx.getMessageType() === MessageType.extendedTextMessage) {
                buffer = await ctx.quoted.media.toBuffer();
                base64data = await buffer.toString('base64');
            } else if (ctx.getMessageType() === MessageType.imageMessage) {
                buffer = await ctx.msg.media.toBuffer();
                base64data = await buffer.toString('base64');
            }
            mime = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.mimetype;
            prompt = m?.message?.extendedTextMessage?.text
            prompt = prompt.replace(prompt.split(' ')[0], '');

        } else {
            prompt = data;
        }

        if (base64data) {
            message = [{
                'role': 'user',
                'content': prompt + ', jelaskan dengan detail dalam bahasa indonesia',
                'data': {
                    'fileText': '',
                    'imageBase64': 'data:' + mime + ';base64,' + base64data ?? null,
                }
            }]
        } else {
            if (responseDocument) {
                message = [{
                    'id': randomString(7),
                    'role': 'user',
                    'content': prompt.replace('.bang', ''),
                    'data': {
                        fileText: responseDocument,
                    }
                }
                ]
            } else {
                message = [{
                    'id': randomString(7),
                    'role': 'user',
                    'content': prompt + ', jelaskan dengan detail dalam bahasa indonesia'
                }
                ]
            }
        }

        try {
            let loop = true;
            while (loop) {
                await axios({
                    method: 'POST',
                    url: 'https://www.blackbox.ai/api/chat',
                    headers: {
                        'Cookie': 'sessionId=17269d52-1ae2-4576-9c27-' + randomString(12) + ';',
                        'Origin': 'https://www.blackbox.ai',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
                    },
                    data: {
                        'messages': message,
                        'id': chat_id,
                        'mode': isContinue,
                        'previewToken': null,
                        'userId': null,
                        'codeModelMode': true,
                        'agentMode': {},
                        'trendingAgentMode': {},
                        'isMicMode': false,
                        'userSystemPrompt': null,
                        'maxTokens': 1024,
                        'playgroundTopP': 0.9,
                        'playgroundTemperature': 0.5,
                        'isChromeExt': false,
                        'githubToken': null,
                        'clickedAnswer2': false,
                        'clickedAnswer3': false,
                        'clickedForceWebSearch': false, 'visitFromDelta': false,
                        'mobileClient': false, 'userSelectedModel': null,
                        'validated': '00f37b34-a166-4efb-bce5-1312d87f2f94'
                    }
                }).then(async (response) => {
                    let text = await response.data;
                    if ((/\$~~~\$/).test(text)) {
                        message.push(
                            {
                                'id': randomString(7),
                                'role': 'assistant',
                                'content': text,
                                'createdAt': new Date()
                            }
                        )
                        isContinue = 'continue'
                    } else {
                        let tmpMsg;
                        loop = false;
                        message.push({
                            content: text
                        })
                        let result = '';
                        message.map((item, index) => {
                            tmpMsg = item.content;
                            if (index != '0' || item.content != tmpMsg) {
                                result += item.content + ' ';
                            }
                        })

                        let reply = '✅ Success\n'
                        if ((/\$~~~\$(.*)\$~~~\$\n/g).test(result)) {
                            let array = result.match(/\$~~~\$(.*)\$~~~\$\n/g);
                            let text = result.replaceAll(array[0], '');
                            let split = result.toString().split(array[0])
                            text = split[split.length - 1]

                            let words = text.split(' ');
                            let uniqueWords = {};
                            let newText = '';

                            words.forEach(word => {
                                if (!uniqueWords[word]) {
                                    uniqueWords[word] = true;
                                    newText += word + ' ';
                                }
                            });

                            text = newText;

                            reply += text.replaceAll('**', '*');
                            reply += '\n\n🌐 Referensi terkait :\n\n'

                            array = JSON.stringify(array[
                                0]).replaceAll('$~~~$', '').replaceAll('\\n', '')
                            array = JSON.parse(JSON.parse(array));

                            array.map((item, index) => {
                                reply += `» *Title* : ${item.title}\n» *Snippet* : ${item.snippet}\n» *Date* : ${item.date}\n» *Link* : ${item.link}\n\n`;
                            })
                        } else {
                            reply = result.replace('$@$v=undefined-rv1$@$', '').replaceAll('**', '*');
                        }

                        reply = reply.replace('Generated by BLACKBOX.AI, try unlimited chat https://www.blackbox.ai\n\n', '');
                        await ctx.reply({ text: reply }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                        await ctx.react(ctx.id, '✅')
                    }
                }).catch(async (err) => {
                    loop = false;
                    await ctx.react(ctx.id, '⛔')
                    await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                })
            }


        } catch (err) {
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}