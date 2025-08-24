import xss from 'xss';

// Sanitize request body to prevent XSS and injection attacks
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key].trim());
      }
    });
  }
  next();
};

// Sanitize query parameters
export const sanitizeQuery = (req, res, next) => {
  if (req.query) {
    Object.keys(req.query).forEach((key) => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = xss(req.query[key].trim());
      }
    });
  }
  next();
};

// Sanitize URL parameters
export const sanitizeParams = (req, res, next) => {
  if (req.params) {
    Object.keys(req.params).forEach((key) => {
      if (typeof req.params[key] === 'string') {
        req.params[key] = xss(req.params[key].trim());
      }
    });
  }
  next();
};

// Apply all sanitization middleware
export const sanitizeAll = [sanitizeBody, sanitizeQuery, sanitizeParams];
