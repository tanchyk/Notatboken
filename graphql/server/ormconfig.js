module.exports = {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: `${process.env.POSTGRES_USER}`,
        password: `${process.env.POSTGRES_PASSWORD}`,
        database: "Notatboken",
        entities: ["dist/entities/*.js"],
        migrations: ["dist/migrations/*.js"],
        synchronize: true,
        logging: true
}