export default function randomId (prefix = 'r_') {
    return prefix + Math.random().toString(16).substring(2)
}
