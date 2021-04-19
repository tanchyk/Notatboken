module.exports = [
  {
    name: "development",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: "Notatboken",
    synchronize: true,
    logging: true
  },
  {
    name: "test",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: `${process.env.POSTGRES_PASSWORD}`,
    database: "Notatboken-test",
    dropSchema: true,
    synchronize: true,
    logging: false
  }
]