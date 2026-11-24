// Last stop for any error thrown in a route. Four arguments = error handler.
// The client gets clean JSON. A stack trace is logged only for real faults.
const { constraintOf } = require('../errors/db-errors');
const constraintMap = require('../errors/constraint-map');

function errorHandler(err, req, res, next) {
  // A body that is not valid JSON: express.json() throws this before any route runs.
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'The request body is not valid JSON.' },
    });
  }

  // A database rule was broken. The map says what to tell the client.
  // A constraint that is not in the map still answers 409, never 500 and never SQL.
  const constraint = constraintOf(err);
  if (constraint) {
    const known = constraintMap[constraint];
    if (!known) console.error(err); // a rule we forgot to put in the map
    return res.status(known ? known.status : 409).json({
      error: {
        code: known ? known.code : 'CONFLICT',
        message: known ? known.message : 'That change conflicts with existing data.',
      },
    });
  }

  const status = err.status || 500;
  const isServerFault = status >= 500;
  if (isServerFault) console.error(err); // stack traces only for real faults

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