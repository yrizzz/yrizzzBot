import axios from 'axios';
export default {
    name: 'dikti',
    type: 'command',
    code: async (ctx) => {
        let m = ctx._msg;
        let first = m.content.split(' ')[0];
        let data = m.content.replace(first, '').trim();
        const headers = {
            'Host': 'api-pddikti.kemdiktisaintek.go.id', 
            'Origin': 'https://pddikti.kemdiktisaintek.go.id', 
            'Referer': 'https://pddikti.kemdiktisaintek.go.id/', 
            'X-User-IP': ' 103.148.201.72'
        };
        await ctx.react(ctx.id, '⏳')
        try {

            const dikti = await axios.get('https://api-pddikti.kemdiktisaintek.go.id/pencarian/mhs/'+data, {
                headers: headers
            });

            const detailMhs = await axios.get('https://api-pddikti.kemdiktisaintek.go.id/detail/mhs/' + dikti.data[0].id,
                {
                    headers: headers
                }
            );

            let msg = 'Data ditemukan\n';
            msg += '» Nama : ' + detailMhs.data.nama + '\n';
            msg += '» Nim : ' + detailMhs.data.nim + '\n';
            msg += '» Perguruan tinggi : ' + detailMhs.data.nama_pt + '\n';
            msg += '» Jenis kelamin : ' + detailMhs.data.jenis_kelamin + '\n';
            msg += '» Tanggal masuk : ' + detailMhs.data.tanggal_masuk + '\n';
            msg += '» Jenjang - prodi : ' + detailMhs.data.jenjang + ' - ' + detailMhs.data.prodi + '\n';
            msg += '» Status awal mhs : ' + detailMhs.data.jenis_daftar + '\n';
            msg += '» Status akhir mhs : ' + detailMhs.data.status_saat_ini + '\n';

            await ctx.reply({ text: msg }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
            await ctx.react(ctx.id, '✅')
        } catch (err) {
            console.log(err)
            await ctx.react(ctx.id, '⛔')
            await ctx.reply({ text: 'internal server error' }, { ephemeralExpiration: m?.message?.extendedTextMessage?.contextInfo?.expiration ?? 0 });
        }
    }


}

