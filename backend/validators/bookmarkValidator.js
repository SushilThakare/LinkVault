const Joi = require('joi');

const validateBookmark = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    url: Joi.string().uri().required(),       // Must be a valid URL
    description: Joi.string().max(500).allow(''),  // Optional
    tags: Joi.array().items(Joi.string()),    // Array of tag names (optional)
  });

  const { error } = schema.validate(req.body);

  if (error) {
    res.status(400);
    return next(new Error(error.details[0].message));
  }

  next();
};

module.exports = { validateBookmark };