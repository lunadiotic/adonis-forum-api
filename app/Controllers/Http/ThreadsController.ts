import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Thread from 'App/Models/Thread'
import ThreadValidator from 'App/Validators/ThreadValidator'

export default class ThreadsController {
  public async index({ response }: HttpContextContract) {
    try {
      // const threads = await Thread.all()
      const threads = await Thread.query().preload('user').preload('category').preload('replies')
      return response.status(200).json({
        data: threads,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      })
    }
  }
  public async store({ request, auth, response }: HttpContextContract) {
    const validateData = await request.validate(ThreadValidator)

    try {
      const thread = await auth.user?.related('threads').create(validateData)
      await thread?.load('category')
      await thread?.load('user')
      return response.status(201).json({
        data: thread,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      })
    }
  }
  public async show({ params, response }: HttpContextContract) {
    try {
      const thread = await Thread.query()
        .where('id', params.id)
        .preload('user')
        .preload('category')
        .preload('replies')
        .firstOrFail()
      return response.status(200).json({
        data: thread,
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message,
      })
    }
  }

  public async update({ params, auth, request, response }: HttpContextContract) {
    try {
      const user = await auth.user
      const thread = await Thread.findOrFail(params.id)

      if (thread.userId !== user?.id) {
        return response
          .status(403)
          .json({ message: 'Anda tidak memiliki izin untuk mengedit thread ini.' })
      }

      const validateData = await request.validate(ThreadValidator)
      await thread.merge(validateData).save()

      await thread?.load('category')
      await thread?.load('user')

      return response.status(200).json({
        data: thread,
      })
    } catch (error) {
      return response.status(400).json({
        message: error,
      })
    }
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    try {
      const user = await auth.user
      const thread = await Thread.findOrFail(params.id)

      if (thread.userId !== user?.id) {
        return response
          .status(403)
          .json({ message: 'Anda tidak memiliki izin untuk mengedit thread ini.' })
      }

      await thread.delete()
      return response.status(200).json({
        message: 'Thread deleted successfully',
      })
    } catch (error) {
      return response.status(400).json({
        message: error.message || 'Something went wrong',
      })
    }
  }
}
