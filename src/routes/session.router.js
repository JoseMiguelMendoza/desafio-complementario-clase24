import { Router } from 'express'
import passport from 'passport';
import userModel from '../dao/models/user.model.js'

const router = Router()

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failRegister'
}), async(req, res) => {
    res.redirect('/login')
})

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/failLogin'
}), async (req, res) => {
    res.redirect('/products')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
            res.redirect('/userError')
        } else res.redirect('/login')
    })
})

router.get('/github', passport.authenticate('github', { scope: ['user:email']}),
async(req, res) => {})

router.get('/api/session/githubcallback', passport.authenticate('github', {
    failureRedirect: '/login'
}), async(req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

router.get('/api/sessions/current', async(req, res) => {
    if(!req.session.passport) return res.status(401).json({
        status: 'error',
        error: 'No session detected.'
    })
    let user_data = await userModel.findById(req.session.passport.user)
    res.status(200).json({ status: 'success', payload: {
        ID_USER: req.session.passport.user,
        USER_DATA: {
            name: user_data.name,
            surname: user_data.surname,
            email: user_data.email,
            age: user_data.age,
            ID_cart: user_data.cart
        }
    }})
})

export default router