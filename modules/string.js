function upperFirst(s) {
  s = String(typeof s == 'number' ? s : (s || ''))
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function lowerFirst(s) {
  s = String(typeof s == 'number' ? s : (s || ''))
  return s.charAt(0).toLowerCase() + s.slice(1)
}

function camelize(s) {
  return lowerFirst(s.replace(/[_\W]+(.)/g, (match, chr) => chr.toUpperCase()))
}

function toSlug(s) {
  s = String(typeof s == 'number' ? s : (s || '')).trim()
  return s.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    .replace(/đ/gi, 'd')
    .replace(/`|~|!|@|#|\||\$|%|\^|&|\*|\(|\)|\+|=|,|\.|\/|\?|>|<|'|"|:|;|_/gi, '-')
    .replace(/\s\s+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/gi, '-').toLowerCase()
}

String.prototype.upperFirst = function() {
  return upperFirst(this)
}

String.prototype.lowerFirst = function() {
  return lowerFirst(this)
}

String.prototype.camelize = function() {
  return camelize(this)
}

String.prototype.toSlog = function() {
  return toSlug(this)
}

module.exports = {
  upperFirst,
  lowerFirst,
  camelize,
  toSlug
}