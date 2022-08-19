import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Request from '@ioc:Adonis/Core/Request'
import User from 'App/Models/User'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'
import authConfig from '../../../config/auth'

export default class AuthController {

    public async register({ request }): HttpContextContract) {
        const data = await request.validate(RegisterUserValidator)
        const user = await User.create(data)
        return user
    }

    public async login({ request, auth, response }: HttpContextContract) {
        try {
            const { email, password } = request.all()
            const token = await auth.use('api').attempt(email, password, {
                expiresIn: '1day'
            })
            const user = await User.findByOrFail("email",email)
            return { token, user }
        } catch (error) {
            response.status(401).send("Login ou senha incorretos!!!")
        }
    }
}
