
import cluster from 'cluster'

import { startBot } from './src/bot.js'

if (cluster.isPrimary) {
    cluster.fork();

    cluster.on('exit', function(worker, code, signal) {
        console.log("Bot restarting!", code, signal);

        cluster.fork();
    });
}

if (cluster.isWorker) {
	startBot();
}
