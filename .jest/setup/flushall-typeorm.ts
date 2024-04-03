import { getDataSource } from '../../src/infra/storages/db/typeorm/databaseProvider'

global.afterEach(async () => {
	const dataSource = await getDataSource(process.env.NODE_ENV as string, process.env.DATABASE_URL as string)
	try {
		const condominium_members = dataSource.getRepository('condominium_members')
		await condominium_members.query('DELETE FROM "condominium_members"')

		const uniqueRegistries = dataSource.getRepository('unique_registries')
		await uniqueRegistries.query('DELETE FROM "unique_registries"')

		const invites = dataSource.getRepository('condominium_requests')
		await invites.query('DELETE FROM "condominium_requests"')

		const condominiums = dataSource.getRepository('condominiums')
		await condominiums.query('DELETE FROM "condominiums"')

		const users = dataSource.getRepository('users')
		await users.query('DELETE FROM "users"')
	} finally {
		await dataSource.destroy()
	}
})
