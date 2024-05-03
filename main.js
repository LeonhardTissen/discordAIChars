
import cluster from 'cluster'

import { startBot } from './src/bot.js'
import { FgRed } from './src/consolecolors.js';

if (cluster.isPrimary) {
    cluster.fork();

    cluster.on('exit', function(_, code, signal) {
        console.log(`${FgRed}Bot restarting!`, code, signal);

        cluster.fork();
    });
}

if (cluster.isWorker) {
	startBot();
}
