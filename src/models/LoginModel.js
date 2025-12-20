const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    pswd: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });

        if (!this.user) {
            this.errors.push('User not Exists !');
            return;
        }

        if (!bcryptjs.compareSync(this.body.pswd, this.user.pswd)) {
            this.errors.push('Invalid Password !');
            this.user = null;
            return;
        }
    }


    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();
        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.pswd = bcryptjs.hashSync(this.body.pswd, salt);

        this.user = await LoginModel.create(this.body);
    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email })
        if (this.user) this.errors.push('User already exists !');
    }

    valida() {
        this.cleanUp();
        if (!validator.isEmail(this.body.email)) this.errors.push('Invalid Email !');
        if (this.body.pswd.length < 3 || this.body.pswd.length >= 16) this.errors.push('The password must be between 3 and 15 characters.');

    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            pswd: this.body.pswd
        }
    }
}

module.exports = Login;