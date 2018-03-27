const isProdMode = Object.is(process.env.NODE_ENV, 'production')

const cdnURL = isProdMode ? 'https://6pan.cn' : ''

const baseURL = isProdMode ? 'https://6pan.cn/' : 'http://localhost:3000/'

let config = {
  cdnURL,
  baseURL
}

export default config
