const ExpenseService = require("../service/db.services");
module.exports = async (fastify) => {
  const expenseService = new ExpenseService(fastify);
  fastify.get("/", async (request, reply) => {
    const res = await expenseService.getExpenses(request);
    reply.status(res.statusCode).send(res.body);
  });

  fastify.post("/expense", async (request, reply) => {
    const res = await expenseService.addExpenses(request);
    reply.status(res.statusCode).send(res.body);
  });
};
