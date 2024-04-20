
import { startBot } from './bot.js'
import cluster from 'cluster'

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
