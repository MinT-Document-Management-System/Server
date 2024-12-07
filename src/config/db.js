require('dotenv').config();

const { Sequelize } = require('sequelize')            // As our development is based on model, we use sequelize package instead of Pool 

// PostgreSQL connection configuration
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD, 
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    logging: false,  // (optional)
    dialectOptions: {
      ssl: {
        require: true,              // SSL is forced
        rejectUnauthorized: false   // self-assigned certificates are allowed
      }
    }
  }

)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to Supabase PostgreSQL has been established successfully.')
  } catch(error) {
    console.log('Unable to connect to the database:', error);
  }
}

connectToDatabase();

module.exports = sequelize;
