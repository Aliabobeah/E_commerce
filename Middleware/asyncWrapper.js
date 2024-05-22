// module.exports = (asyncFn) => {
//     return (req, res, next) => {
//         asyncFn (req, res, next).catch((err) => {
//             next(err)
//         });
//     }
// } 
const asyncWrapper = (fn) => {
    return function (req, res, next) {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };

  module.exports = asyncWrapper;

