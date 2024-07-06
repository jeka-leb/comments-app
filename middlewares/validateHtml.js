const AppError = require('../utils/appError');

const allowedTags = ['a', 'code', 'i', 'strong'];
const allowedAttributes = {
  a: ['href', 'title'],
};

const validateHtmlMiddleware = (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return new AppError('Text is required', 400);
  }

  // Reg exp to find html elements
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  let match;
  let isValid = true;
  const errors = [];

  while ((match = tagRegex.exec(text)) !== null) {
    const tagName = match[1].toLowerCase();

    if (!allowedTags.includes(tagName)) {
      isValid = false;
      errors.push(`Tag <${tagName}> is not allowed`);
    } else {
      // Check for attributes
      if (match[0].startsWith('<') && !match[0].startsWith('</')) {
        const attributesString = match[0]
          .replace(/<\/?([a-z][a-z0-9]*)\b/gi, '')
          .replace(/>/, '');
        const attributes =
          attributesString.match(
            /([a-zA-Z:]+)(?:=("[^"]*"|'[^']*'|[^"'\s]*))?/g
          ) || [];

        attributes.forEach((attribute) => {
          const [attrName] = attribute.split('=');
          if (!allowedAttributes[tagName]?.includes(attrName)) {
            isValid = false;
            errors.push(
              `Attribute "${attrName}" is not allowed in tag <${tagName}>`
            );
          }
        });
      }
    }
  }

  // Check if tags are closed correctly
  const closingTagRegex = /<\/([a-z][a-z0-9]*)>/gi;
  const openingTags = [...text.matchAll(tagRegex)]
    .filter((m) => !m[0].startsWith('</'))
    .map((m) => m[1]);
  const closingTags = [...text.matchAll(closingTagRegex)].map((m) => m[1]);

  if (
    openingTags.length !== closingTags.length ||
    openingTags.some((tag, i) => tag !== closingTags[i])
  ) {
    isValid = false;
    errors.push('Tags are not properly closed');
  }

  if (!isValid) {
    return next(new AppError(`Invalid HTML. ${errors.join('; ')}`, 400));
  }

  next();
};

module.exports = validateHtmlMiddleware;
