module.exports = {
    "name": "development",
    "type": "postgres",
    "host": "db",
    "port": 5432,
    "username": "postgres",
    "password": `${process.env.POSTGRES_PASSWORD}`,
    "database": "Notatboken",
    "synchronize": true,
    "logging": false
}