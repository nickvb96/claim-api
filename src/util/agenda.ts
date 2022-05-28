import db from './database';
import { Agenda } from 'agenda';
import { logger } from './logger';
import { measureBalances } from '@/jobs/fetchBalance';
import { jobCalculateRewards } from '@/jobs/calculateRewards';

export const eventNameRequireTransactions = 'requireTransactions';
export const eventNameFetchBalance = 'fetchBalances';
export const eventNameCalculateRewards = 'jobCalculateRewards';

export const agenda = new Agenda({
    maxConcurrency: 1,
    lockLimit: 1,
    processEvery: '1 second',
});

agenda.define(eventNameFetchBalance, measureBalances);
agenda.define(eventNameCalculateRewards, jobCalculateRewards);

db.connection.once('open', async () => {
    agenda.mongo(db.connection.getClient().db(), 'jobs');
    await agenda.start();

    // Runs every 8 hours starting at 00:00, skips the initialization measurement.
    await agenda.every('0 */8 * * *', 'Fetch balances of every user', eventNameFetchBalance, {
        skipImmediate: true,
        timezone: 'Europe/Amsterdam',
    });

    await agenda.every('0 1 * * 0', 'Calculate all rewards of every eligible user', eventNameCalculateRewards, {
        skipImmediate: false,
        timezone: 'Europe/Amsterdam',
    });

    logger.info('Started agenda processing');
});
