import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ThreadFactory from 'Database/factories/ThreadFactory'

export default class extends BaseSeeder {
  public async run() {
    await ThreadFactory.createMany(50)
  }
}
