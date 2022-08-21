const Todo = require("../models/Todo");

const TODOS_PER_PAGE = 10;

const retrieveTodos = async (req, res, next) => {
  const page = Number(req.query.page) || 1;

  try {
    const todosCount = await Todo.countDocuments();
    const totalPages = Math.ceil(todosCount / TODOS_PER_PAGE);
    const hasNext = page * TODOS_PER_PAGE <= todosCount;
    const hasPrev = page !== 1;

    if (page > totalPages) {
      throw new Error("This page index doesn't exists.");
    }

    const todos = await Todo.find()
      .sort({ _id: -1 }) // reverse the order of todos
      .skip(TODOS_PER_PAGE * (page - 1))
      .limit(TODOS_PER_PAGE);

    // generates next or prev page url
    const generateLink = (isPrev) =>
      `${req.protocol}://${req.get("host")}${
        req.originalUrl.split("?")[0]
      }?page=${isPrev ? page - 1 : page + 1}`;

    console.log(generateLink(false));
    console.log(generateLink(true));

    res.json({
      count: todosCount,
      currPage: page,
      nextPageLink: hasNext ? generateLink(false) : null,
      prevLink: hasPrev ? generateLink(true) : null,
      hasPrev,
      hasNext,
      totalPages,
      todos,
    });
  } catch (err) {
    next(err);
  }
};

const createTodo = async (req, res, next) => {
  const { title, description, isDone, isRemoved } = req.body;

  try {
    const createTodo = await Todo.create({
      title,
      description,
      isDone,
      isRemoved,
      userId: "62f665ad151dd7519adedcca",
    });

    res.status(201).json({
      message: "Todo created.",
      todo: createTodo,
    });
  } catch (err) {
    next(err);
  }
};

const retrieveSingleTodo = async (req, res) => {
  const { todoId } = req.params;
};

module.exports = { retrieveTodos, retrieveSingleTodo, createTodo };