const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive whole number')
  .toInt();

const title = () => body('title')                  // title VARCHAR(80) NOT NULL, at least 3
  .exists().withMessage('title is required')
  .bail()
  .isString().withMessage('title must be text')
  .bail()
  .trim()
  .isLength({ min: 3, max: 80 }).withMessage('title must be 3 to 80 characters long');

const description = () => body('description')      // description VARCHAR(255), may be NULL
  .optional({ values: 'null' })
  .isString().withMessage('description must be text')
  .bail()
  .trim()
  .isLength({ max: 255 }).withMessage('description must be at most 255 characters long');

const subject = () => body('subject')              // subject VARCHAR(60), may be NULL
  .optional({ values: 'null' })
  .isString().withMessage('subject must be text')
  .bail()
  .trim()
  .isLength({ max: 60 }).withMessage('subject must be at most 60 characters long');

const gradeLevel = () => body('grade_level')       // grade_level VARCHAR(30), may be NULL
  .optional({ values: 'null' })
  .isString().withMessage('grade_level must be text')
  .bail()
  .trim()
  .isLength({ max: 30 }).withMessage('grade_level must be at most 30 characters long');

const createRules = [title(), description(), subject(), gradeLevel()];

// PATCH changes only what is sent: every field is optional, but not all of them at once.
const updateRules = [
  idParam,
  title().optional(),
  description(),
  subject(),
  gradeLevel(),
  body().custom((value) => {
    const sent = Object.keys(value || {});
    const allowed = ['title', 'description', 'subject', 'grade_level'];
    if (!sent.some((key) => allowed.includes(key))) {
      throw new Error('send at least one of: title, description, subject, grade_level');
    }
    return true;
  }),
];

module.exports = { idParam, createRules, updateRules };