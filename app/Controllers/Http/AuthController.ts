import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import RegisterValidator from 'App/Validators/RegisterValidator'

export default class AuthController {
  public async register({ request, auth, response }: HttpContextContract) {
    const validatedData = await request.validate(RegisterValidator)

    const user = await User.create(validatedData)

    const token = await auth.login(user)

    return response.status(201).json({
      user,
      token,
    })
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = await request.all()
    try {
      const token = await auth.attempt(email, password)
      return response.status(200).json({
        user: token.user,
        token: token.token,
      })
    } catch (error) {
      return response.status(401).json({
        message: error.message,
      })
    }
  }
}
