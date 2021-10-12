import redis from 'redis';
import redisConfig from '_/configs/redis';
import logger from '_/utils/logger';
import bluebird from 'bluebird';

// Use bluebird lib to solve getAsync problem. see more info https://gist.github.com/michaelbertoni/aa776994b09f87a452676265d0a41532
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// redis connector
const redisClient = redis.createClient(redisConfig);

redisClient.on('connect', () => {
	logger.info('Redis Client connected');
});

export default redisClient;
