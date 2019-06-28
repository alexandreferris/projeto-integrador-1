const log4js = require('log4js')
log4js.configure({
	appenders: {acesso: { type: 'file', filename: 'logs/acesso.log' }},
	categories: {default: { appenders: ['acesso'], level: 'info' }}
})

const logger = log4js.getLogger('acesso')
const stringifyObject = require('stringify-object')

/**
 * @param {string} msg
 * @param {json} params
 */
export function logInfo (msg, params = null) {
	let logParams = (params !== undefined && params !== null) ? ', parametros: ' + stringifyObject(params) : ''
	logger.info(msg + logParams)
}

/**
 * @param {string} msg
 * @param {json} errorMsg
 */
export function logError (msg, errorMsg = null) {
	let logParams = (errorMsg !== undefined && errorMsg !== null) ? ', error: ' + errorMsg : ''
	logger.error(msg + logParams)
}
