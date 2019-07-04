/**
 * @summary function return the value match with destination path in object,
 * @description
 * Ex:
 *    obGet({ a: { b: 1 } }, 'a.b') == obj.a.b == 1
 *
 * if there are many destinations then return first value found
 * Ex:
 *    obGet({ a: { b: 1, c: 1 } }, 'a.x', 'a.b', 'a.c') == obj.a.b == 1
 *
 * if all destinations are not valid in object, then return null
 * Ex:
 *    obGet({ a: { b: 1 } }, 'a.b.c.d') == null
 *    obGet({ a: { b: 1 } }, 'a.e', 'x.y') == null
 *
 * @returns {any}
 * @param {Object} obj
 * @param {...String | [String]} destinations
 * @param {any} defaultValue
 */
function obGet(obj, ...destinations) {
  let defaultValue = null
  if (obj) {
    if(destinations.length > 1 && typeof destinations[destinations.length - 1] != 'string') {
      defaultValue = destinations[destinations.length - 1]
      destinations.pop()
    }
    if(destinations[0] instanceof Array) {
      if(destinations.length > 1) {
        defaultValue = destinations[1]
        destinations = destinations[0]
      }
    }
    while (destinations.length) {
      let value = _obGet(obj, destinations[0])
      if (value) {
        return value
      } else {
        destinations.shift()
      }
    }
  }
  return defaultValue
}

/**
 * @summary function return the value match with destination in object,
 * @description
 * Ex:
 *    obGet({ a: { b: 1 } }, 'a.b') == 1
 *
 * if the destination is not valid in object, then return null
 * Ex:
 *    obGet({ a: { b: 1 } }, 'a.b.c.d') == null
 *
 * @returns obj[destination] || null
 * @param {Object} obj
 * @param {String} destination
 */
function _obGet(obj, destination) {
  if (obj && typeof destination == "string") {
    if (destination == "this") return obj
    let arr = destination.split(".")
    while (arr.length && (obj = obj[arr.shift()])) { }
    return obj
  }
  return null
}

/**
 * @summary function set the value to object destination
 * @description
 * Ex:
 *    obSet({ a: { b: 1 } }, 'a.c', 2) == 2
 *    //obj = { a: { b: 1, c: 2 } }
 *
 * if the destination is not valid in object, then return null
 * Ex:
 *    obSet({ a: { b: 1 } }, 'a.x.y', 2) == null
 *
 * @returns (obj[destination] = value) || null
 * @param {Object} obj
 * @param {String} destination
 * @param {any} value
 */
function obSet(obj, destination, value) {
  if (obj && typeof destination == "string") {
    let arr = destination.split(".")
    if (arr.length == 1) {
      return (obj[arr[0]] = value)
    }
    while (arr.length > 1 && (obj = obj[arr.shift()])) {
      if (arr.length == 1) {
        return (obj[arr[0]] = value)
      }
    }
  }
  return null
}

/**
 * @summary assign props from source to target, can be filter by keys
 * @description
 *  assign all source's keys from source to target when keys == '*'
 *  assign selected keys from source to target when keys is []
 *  assign all target's keys from source to target when keys undefined
 * 
 * @returns assigned target
 * @param {Object} target
 * @param {Array} source 
 * @param {String | Array | undefined} keys 
 */
function obBind(target, source, keys) {
  if (!(target instanceof Object) || !(source instanceof Object)) return
  let bindKeys = (keys == '*')
    ? Object.keys(source)
    : keys instanceof Array
      ? keys
      : Object.keys(target)
  for (let key of bindKeys) {
    target[key] = source[key]
  }
  return target
}

/**
 * @summary equivalent to JSON.parse(JSON.stringify(source))
 * @param {Object} source
 */
function obClone(source) {
  if (typeof source !== "object") return source
  const target = source instanceof Array ? [] : {}
  _deepClone(source, target)
  return target
}

/**
 * @summary clone from source and write to target
 * @param {Object} source
 * @param {Object} target
 */
function _deepClone(source, target) {
  for (let key in source) {
    if (!source.hasOwnProperty(key)) continue
    if (!source[key] || typeof source[key] !== "object") {
      target[key] = source[key]
    } else {
      target[key] = Array.isArray(source[key]) ? [] : {}
      _deepClone(source[key], target[key])
    }
  }
}

/**
 * make a flat Object from source
 * Ex: flat({ a: 1, b: { c: 2, d: 3 } }) = { a: 1, 'b.c': 2, 'b.d': 3 }
 * 
 * @param {Object} source 
 * @param {String} delimiter 
 */
function obFlat(source = {}, delimiter = '.') {
  let result = {}
  for (let key in source) {
    if (!source.hasOwnProperty(key)) continue
    let value = source[key]
    if (value instanceof Object) {
      let flatValue = obFlat(value)
      for (let childKey in flatValue) {
        result[`${key}${delimiter}${childKey}`] = flatValue[childKey]
      }
    } else {
      result[key] = value
    }
  }
  return result
}

/**
 * make a flat Object from source
 * Ex: deFlat({ a: 1, 'b.c': 2, 'b.d': 3 }) = { a: 1, b: { c: 2, d: 3 } }
 * 
 * @param {Object} source 
 * @param {String} delimiter 
 */
function obDeFlat(source = {}, delimiter = '.') {
  let result = {}
  let nesteds = {}
  for(let key in source) {
    if(!source.hasOwnProperty(key)) continue
    let value = source[key]
    if(!key.includes(delimiter)) {
      result[key] = value
    } else {
      let childKey = key.substring(0, key.indexOf(delimiter))
      let nestedKey = key.substring(key.indexOf(delimiter) + 1)
      if(!nesteds[childKey]) {
        nesteds[childKey] = {}
      }
      nesteds[childKey][nestedKey] = value
    }
  }
  for(let key in nesteds) {
    let value = nesteds[key]
    result[key] = obDeFlat(value)
  }
  return result
}

function obMap(obj = {}, formatter = (key, value) => value, filter = () => true) {
  if(obj instanceof Object) {
    let result = {}
    for(let [key, value] of Object.entries(obj)) {
      if(obj.hasOwnProperty(key) && filter(key, value)) {
        result[key] = formatter(key, value)
      }
    }
    return result
  }
  return null
}

Object.defineProperty(Object.prototype, 'obSet', {
  /**
   * @summary call obSet on this
   * @param {String} destination 
   * @param {any} value 
   */
  value: function (destination, value) {
    return obSet(this, destination, value)
  }
})

Object.defineProperty(Object.prototype, 'obGet', {
  /**
   * @summary call obGet on this
   * @param {...String} destination 
   */
  value: function (...destinations) {
    return obGet(this, ...destinations)
  }
})

Object.defineProperty(Object.prototype, 'obBind', {
  /**
   * @summary call obBind on this
   * @param {Array} source 
   * @param {String | Array | undefined} keys 
   */
  value: function (source, keys) {
    return obBind(this, source, keys)
  }
})

Object.defineProperty(Object.prototype, 'obClone', {
  /**
   * @summary call obClone on this
   */
  value: function () {
    return obClone(this)
  }
})

Object.defineProperty(Object.prototype, 'obFlat', {
  /**
   * @summary call flat on this
   * @param {String} delimiter 
   */
  value: function(delimiter) {
    return obFlat(this, delimiter)
  }
})

Object.defineProperty(Object.prototype, 'obDeFlat', {
  /**
   * @summary call deFlat on this
   * @param {String} delimiter 
   */
  value: function(delimiter) {
    return obDeFlat(this, delimiter)
  }
})

Object.defineProperty(Object.prototype, 'obMap', {
  value: function(formatter, filter) {
    return obMap(this, formatter, filter)
  }
})

module.exports = {
  obGet,
  obSet,
  obBind,
  obClone,
  obFlat,
  obDeFlat,
  obMap
}
