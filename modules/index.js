const uObject = require('./object')
const uNumber = require('./number')
const uString = require('./string')

module.exports = {
  ...uObject,
  ...uNumber,
  ...uString
}