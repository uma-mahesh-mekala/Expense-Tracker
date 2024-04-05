const fastify = require("fastify");
const AutoLoad = require("@fastify/autoload");
const formbody = require("@fastify/formbody");
const path = require("path");
const db = require("./plugins/db.plugins");
const mongoose = require("mongoose");
const cors = require("@fastify/cors");
const dotenv = require("dotenv");
dotenv.config();

const buildServer = async () => {
  const Fastify = fastify();

  Fastify.register(db)
    .register(cors)
    .register(formbody)
    .register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
    });

  return Fastify;
};

buildServer()
  .then((fastifyInstance) => {
    console.log(fastifyInstance.printRoutes());

    const date = new Date().toISOString().slice(0, 10);
    console.log(date);

    const serverOptions = {
      port: process.env.APP_PORT,
      host: process.env.APP_HOST,
    };
    fastifyInstance.listen(serverOptions, (err, address) => {
      if (err) fastifyInstance.log.error(err);

      console.log(`Server running on ${address}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
