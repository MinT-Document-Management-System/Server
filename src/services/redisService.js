require('dotenv').config();
const { createClient } = require('ioredis');

const redis_client = createClient({
    url: `rediss://default:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    tls: {
        rejectUnauthorized: false // Required for Upstash
    },
    commandTimeout: 10000 // 10 seconds
});

redis_client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = redis_client;
