module.exports = {
    "name": "development",
    "type": "postgres",
    "host": `${process.env.DB}`,
    "port": 5432,
    "username": "postgres",
    "password": `${process.env.POSTGRES_PASSWORD}`,
    "database": "Notatboken",
    "synchronize": true,
    "logging": false
}