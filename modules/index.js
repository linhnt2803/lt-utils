const uObject = require('./object')
const uArray = require('./array')
const uNumber = require('./number')
const uString = require('./string')

module.exports = {
  ...uObject,
  ...uArray,
  ...uNumber,
  ...uString
}