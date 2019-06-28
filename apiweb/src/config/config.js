import dotenv from 'dotenv'
// require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV

if (NODE_ENV === 'development' || NODE_ENV === 'test') dotenv.config()

export default {
	db: {
		user: process.env.GERENCIAMENTO_CONTAS_DATABASE_USER || 'alexandreferris',
		pass: process.env.GERENCIAMENTO_CONTAS_DATABASE_PASS || '',
		host: process.env.GERENCIAMENTO_CONTAS_DATABASE_HOST || 'localhost',
		port: process.env.GERENCIAMENTO_CONTAS_DATABASE_PORT || 5432,
		database: process.env.GERENCIAMENTO_CONTAS_DATABASE_DEV || 'gerenciamento_contas'
	},
	auth: {
		secret: process.env.GERENCIAMENTO_CONTAS_JWT_SECRET || 'secret'
	},
	api: {
		port: (NODE_ENV === 'production') ? process.env.API_PORT : 9002,
		upload_directory: process.env.GERENCIAMENTO_CONTAS_UPLOAD_DIRECTORY || '/tmp/'
	},
	microservices: {
		url: process.env.GERENCIAMENTO_CONTAS_MICROSERVICES_URL || 'http://localhost:4000/microservices'
	}
}
