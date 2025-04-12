import cfonts from 'cfonts';
import chalk from 'chalk';
import { createRequire } from "module";
import main from './main.js';

const pkg = createRequire(import.meta.url)("./package.json");
global.chalk = chalk;
global.print = console.log;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

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

        print(chalk.blue(`Version : ${pkg.version}`))
        print(chalk.blue(`Author : ${pkg.author}`))
        print(chalk.blue(`Base Bot : CkpTw`))
        print('')
        print(`${pkg.name} wait for preparation ...`);
        await sleep(1000);
        main();

    } catch (msg) {
        print(msg)
    }

}

run()






