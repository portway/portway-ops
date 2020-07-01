const { Pool } = require("pg");

const config = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: DB_USE_SSL === 'true'
}

const pool = new Pool(config);

pool.on('error', console.error)

pool.on('acquire', (client) => {
  console.log('db/acquired client')
})

module.exports = {
  query: (text, params) => {
    console.log('db/query')
    const args = [text]
    if (params) {
      args.push(params)
    }
    return pool.query(...args)
  }
}
