import axios from 'axios';
import { MessageType } from "@mengkodingan/ckptw";
import * as cheerio from 'cheerio';
import fs from 'fs';
import FormData from 'form-data';

export default {
    name: 'itl',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '');
        await ctx.react(ctx.id, '⏳')
        try {

            let text, type = 'img', buffer;
            try {
                if (ctx.getMessageType() === MessageType.extendedTextMessage) {
                    buffer = await ctx.quoted.media.toBuffer();
                } else if (ctx.getMessageType() === MessageType.imageMessage) {
                    buffer = await ctx.msg.media.toBuffer();
                } else {
                    return false;
                }
            } catch (err) {
                await ctx.reply({ text: 'image not found' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                await ctx.react(ctx.id, '⛔')
            }

            if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation) {
                text = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation;
            } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text) {
                text = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text
            } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption) {
                text = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.caption;
            } else if (m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption) {
                text = m?.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage?.caption;
            } else {
                text = data
            }

            if (data == '') {
                data = 'img'
            }

            if ((/\s/).test(text)) {
                if (text.split(' ')[1] == 'img') {
                    type = 'img';
                } else if (text.split(' ')[1] == 'link') {
                    type = 'link';
                } else {
                    type = data ?? 'img';
                }
            } else {
                type = data ?? 'img';
            }

            let form = new FormData();
            var buf = Buffer.from(buffer);
            form.append('encoded_image', await fs.createReadStream('./test.jpg'));

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://lens.google.com/v3/upload?hl=id&st=1738380983201&vpw=1000&vph=1000&ep=gisbubb',
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary2BLHgStxK4aP8MN0',
                    'Cookie': ' HSID=A_FYg7zapIFjw8juA; SSID=A9hh2W_COkSNLQBqU; APISID=pOWiVjy4YocyLkoh/AKugk9jzjm_JKCYdG; SAPISID=1pkKJxPdQm9FU9rP/AtNgxc5H0gouBK-FL; __Secure-1PAPISID=1pkKJxPdQm9FU9rP/AtNgxc5H0gouBK-FL; __Secure-3PAPISID=1pkKJxPdQm9FU9rP/AtNgxc5H0gouBK-FL; SID=g.a000sgiY42-xkNoM4BYSYdQ7bn561lecrE9vn1oPyQFsvEiG5hCmXLOnyOazBCvtFiGYz8tt9AACgYKAYcSARASFQHGX2Mi_YRuevFyJle25QN6PwjZYRoVAUF8yKpaPrFbCy7qhf_oLW6CzNtK0076;; AEC=AVcja2eZXnER5hxQ-4fvftfa0hb82FL1zJIcommstgcWWgSmgi-nOjHri3I; NID=521=Qip3PA5JWTsd2EI9LmObyF2_q_ZJkLXBop4NcMHI93izRK99CBppAhsaxufg-3c5vtoyjpVSi-R1BoYkNiV6n4ZqHKsiRtgOGidWi6BmWDiVw2LumxUWci2tt7qAFn2R0HEM7PFFtdxK9vsThiG5PMqW8cakABf7XKEZ0a_5TYnrfb0dwVD7Hf1T5jz6UdPdfCBBH9BUOLTWpFj_Pz8G7IeaIbBs2TcKNThIJyTwzF18eOXbIBp3amLMF7bNI-Mp8_Od2VxOVo-eTLGEXQGdwz-ztVZamT95MK8Ug4JqXMeRW9NCtvFJVlwvJiEtZwlwTDAnLaBMCAUVGFDlb2esOxUHN95TmnRzYrZWH5ZJBApheYNT6QvuYkGiJFSNHUevhbx8lP4xKCukLlao-piUlkI5z49uwYnG4OT6pg7qK3xKmCjcc8EXR70lj9YpmIBELQyiwHdDQq1eBw6JxCe_zk_80S9hgkDv_1vuxGaECceAuPCACifTzM7_5OB_T9_dMkSJifLFixFJKZwL5gtFr5kxSTKxraon3V46WiA2zf1DgooOHuTjTcN8FWKXCyJuGQq3oLf9rs4JDp-sbngLui0jb6YmOa2uAcJUSlcfP53khWB39eZyBsRwrrt9sTOeC4QiLfVpoHDHGblufPV4nIFDKvxwqO0h7EfnjgUPLPTaP2bCtMJyygK7cdEg3GgLMEEArL0vofpn3PIe5Cg7GUXmX1UzxbeJLYt8YJ8L4SYAUWQOBJhx0WwH0l5n9WQfYGtHs7oDdzl6ClmKgCKmdUMBM8uZACjXxc9HYY2e42rgIILiJyVbOY3jTYe6dw7E8AdOvc6PtFsldnyFGZdxHYoKy0lD5LGz5BY-ksJmWdDtZAxtmkzaUpe9GOnmtCT8X-zQ8yl9MuMPQ1n9IK69L0ACG0UTlJ_fisox-moPADAVWUZDctuz00bPRgLOAFW_aLc3-Iyn1rrCqfo0FA86ar2UYjUr7Dx7bKPgldioxjno9ipBqLeUuFB1yN5SHSalzRUiMnnjYDxPNrUj_6HnLGXXR3eNrbpbabq2I_bfzzVbiBerumgXGxR2-ILKY-27pxkzPoHptGU9emc086Zi5RuMImgd6zhSBf_vAttRY42UV7KU52W5KmYEeOXski-LWbSJMN0LRbJE2VHsfAIaPn9SwPJiOe0TRhA-WLaVEaowJ2f4aCOXGT9D-MBQpsiGITvfZ51EeIvDYuKlHby7kQK8PQCLwzvTdi-XYdtxOcrgxBPuimcufQQzcAB9BypeoY2dH9t-q4d2XkFfGtD3NEH-ju_Sp43czQeZwpAQejH9pHtj5ukk123DPZx-O9GZKKXgNhGB6KVPchnKKMU1XWmgxFtJSD1x7n32vIsMk5IgmO42NWnhbREnMRWtru2kthZKY77wH-YFNhqN2em9Xje2aLU; SEARCH_SAMESITE=CgQIl50B; SIDCC=AKEyXzVPjlN1ATZuBuwdOIdBFJaGTLLNIgVxL90cutavZXfHJ7jEO_LmhVWCSxVly7pfUrOKlD22',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
                    ...form.getHeaders()
                },
                data: form
            };

            axios.request(config)
                .then(async (response) => {
                    let no = 1;
                    const result = response.data;
                    await fs.writeFileSync('test.txt',result.toString());
                    const $ = cheerio.load(result);
                    let rply = '✅ Success\n\n';
                    let div = $('div[class="R8rd3e my5z3d CUMKHb"]')
                    div.map((index, item) => {
                        if (type == 'img') {
                            var link = $(item).find('a:nth-child(1)').attr('href');
                            link = link?.split('&')[8]?.replace('imgurl=', '');
                        } else {
                            var link = $(item).find('a:nth-child(2)').attr('href');
                        }
                        rply += `» ${no} ${link}\n\n`
                        no++;
                    })


                    await ctx.reply({ text: rply }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
                    await ctx.react(ctx.id, '✅')

                })
                .catch((error) => {
                    return false;
                });


        } catch (err) {
            console.log(err)
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }
}