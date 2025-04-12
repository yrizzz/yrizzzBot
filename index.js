const cfonts = require('cfonts');
const kleur = require('kleur');
const main = require('./main.js');
const pkg = require('./package.json');

global.print = console.log;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const run = async () => {
    try {
        cfonts.say(pkg.name, {
            font: 'block',
            align: 'left',
            colors: ['green', 'white'],
            background: 'transparent',
            lineHeight: 1,
            space: true,
        });

        print(kleur.blue(`Version : ${pkg.version}`));
        print(kleur.blue(`Author : ${pkg.author}`));
        print(kleur.blue(`Base Bot : CkpTw`));
        print('');
        print(`${pkg.name} wait for preparation ...`);
        await sleep(1000);
        main();
    } catch (msg) {
        print(msg);
    }
};

run();
