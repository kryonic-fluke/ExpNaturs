/*eslint-disable*/

module.exports = (fn) => (
   // Parentheses around fn are optional but recommended
   (req, res, next) => (
    fn(req, res, next).catch(next) // Shorter version: next is already a function
   )
);