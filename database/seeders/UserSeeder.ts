import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'Admin',
        email: 'admin@mail.com',
        password: 'secret',
      },
      {
        name: 'User',
        email: 'user@mail.com',
        password: 'secret',
      },
    ])
  }
}
