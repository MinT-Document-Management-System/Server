require('dotenv').config();
const { createClient } = require('ioredis')

const redis_client = createClient({
    url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

module.exports = redis_client