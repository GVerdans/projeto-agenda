import validator from 'validator';

export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init() {
        this.events();
    }

    events() {
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        })
    }

    validate(e) {
        const el = e.target;
        const emailInput = el.querySelector('input[name="email"]')
        const pswdInput = el.querySelector('input[name="pswd"]')
        let error = false;

        if (!validator.isEmail(emailInput.value)) {
            error = true;

            emailInput.value = '';
            emailInput.classList.add('is-invalid');
            emailInput.setAttribute('placeholder', 'invalid Email !');
        };
        
        if (pswdInput.value.length < 3 || pswdInput.value.length > 16) {
            error = true;
            pswdInput.value = '';
            pswdInput.classList.add('is-invalid');
            pswdInput.setAttribute('placeholder', 'Need between 3 and 15 caracters !');
        }

        if (!error) el.submit();
    }
}