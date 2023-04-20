import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    const validatedData = await request.validate(RegisterValidator)

    const user = await User.create(validatedData)

    const token = await auth.login(user)

    return token
  }
}
