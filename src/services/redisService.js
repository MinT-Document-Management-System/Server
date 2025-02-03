require('dotenv').config();
const Redis = require('ioredis');

const redis_client = new Redis(
    `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
);

redis_client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redis_client;
