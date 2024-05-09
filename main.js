
import cluster from 'cluster'

import { startBot } from './src/bot.js'
import { color } from './src/utils/consolecolors.js';

if (cluster.isPrimary) {
    cluster.fork();

    cluster.on('exit', function(_, code, signal) {
        console.log(`${color.Red}Bot restarting!`, code, signal);

        cluster.fork();
    });
}

if (cluster.isWorker) {
	startBot();
}
