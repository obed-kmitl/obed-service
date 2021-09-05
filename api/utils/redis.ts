import redis from 'redis';
import redisConfig from '_/config/redis';
import logger from '_/middleware/logger';

// redis connector
const redisClient = redis.createClient(redisConfig);

redisClient.on('connect', () => {
	logger.info('redis client connected');
});

export default redisClient;
