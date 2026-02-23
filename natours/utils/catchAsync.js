// this module is only useable for async functions
// only for async functions we have .catch() methods for catching errors
// so fn() function always should be an async function
module.exports = (fn) => {
  return (req, res, next) => {
    //                 catch((err) => next(err));
    fn(req, res, next).catch(next);
  };
};
