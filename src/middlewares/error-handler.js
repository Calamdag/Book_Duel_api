// Last stop for any error thrown in a route. Four arguments = error handler.
// The client gets clean JSON; the stack trace stays in the server log.
function errorHandler(err, req, res, next) {
  console.error(err);

  // A body that is not valid JSON: express.json() throws this before any route runs.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'The request body is not valid JSON.' },
    });
  }

  const status = err.status || 500;
  const isServerFault = status >= 500;

  const body = {
    error: {
      code: isServerFault ? 'INTERNAL_ERROR' : err.code || 'BAD_REQUEST',
      message: isServerFault ? 'Something went wrong on the server.' : err.message,
    },
  };

  // Validation errors list every field that failed. Never for server faults.
  if (!isServerFault && err.details) body.error.details = err.details;

  res.status(status).json(body);
}

module.exports = errorHandler;