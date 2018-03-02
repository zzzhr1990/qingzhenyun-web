const fakeDom = document.createElement('div');

function isString(obj) {
  return 'string' === typeof obj;
}

function isArray(obj) {
  return Array.isArray(obj);
}

function getText(text) {
  fakeDom.innerHTML = text;
  return fakeDom.innerText;
}

function dataTemplate(key, value) {
  const returns = {
    field: key,
    value: value
  }
  if (key === '__raw') {
    returns.value = getText(value);
    returns.__rawValue = value;
  }
  return returns;
}

export default function serializer(response) {
  const result = [];
  let key = '';
  if (isString(response)) {
    result.push(dataTemplate('__raw', response))
  }
  else {
    for (key in response) {
      if (response.hasOwnProperty(key)) {
        if (isArray(response[key])) {
          let len = response[key].length;
          let i = 0;
          for (; i < len; i++) {
            result.push(dataTemplate(key, response[key][i]));
          }
        }
        else if (isString(response[key])) {
          result.push(dataTemplate(key, response[key]));
        }
      }
    }
  }
  return result;
}
