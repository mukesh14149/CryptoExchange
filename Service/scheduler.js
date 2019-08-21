var schedule = require('node-schedule');
const { Crypto } = require('../models/crypto');
const mailer = require('./sendEmail');
const emailTemplate = require('../models/emailTemplate');
sendmail = async function () {
    // Check if any crypto has set priceHittime
    let crypto = await Crypto.findOne({
        priceHitTime: { $exists: true }
    });
    if (crypto) {
        // Send an email
        var emailOptions = Object.assign({}, emailTemplate.Default);
        emailOptions.to = crypto.email;
        emailOptions.subject = "Price Alert!"
        emailOptions.text = "Your Set price for crypto " + crypto.cryptoSymbol + " hit at" + crypto.priceHitTime;
        mailer.sendmail(emailOptions);

        // Delete this task after sending reminder
        await Crypto.deleteOne({
            _id: crypto._id
        });
    }
}
module.exports = function(){
    // Scheduler keep calling sendmail function in every 5sec to check for new price hit data. 
    let startTime = new Date(Date.now());
    schedule.scheduleJob({ start: startTime, rule: '*/5 * * * * *' }, function () {
        sendmail();
    });
}