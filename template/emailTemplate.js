const config = require('config');
class EmailTemplate {
    constructor() {
        this.emailOptions = {
            from: config.get('email'),
            to: config.get('email'),
            subject: 'Greeting from CryptoExchange',
            text: 'Hi!',
        };
    }
    get Default() {
        return this.emailOptions;
    }
}
let email = new EmailTemplate();
module.exports = email;