import fetch from 'node-fetch'

export default (url, args = {}) => {
	args.headers = args.headers || {}
	args.headers[ 'user-agent' ] = 'ReplitPinger'
	return fetch(url, args)
}