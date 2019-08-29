var schedule = require('node-schedule');
const { Crypto } = require('../models/crypto');
const mailer = require('./sendEmail');
const emailTemplate = require('../models/emailTemplate');
sendmail =  function () {

    client.HKEYS("Mail_list", function(err, result){
        result.forEach(element => {
            client.HDEL("Mail_list",element, function(err, result){
                Crypto.findOne({
                    _id: element
                }).then((crypto)=> {
                    if(crypto){
                        var emailOptions = Object.assign({}, emailTemplate.Default);
                        emailOptions.to = crypto.email;
                        emailOptions.subject = "Price Alert!"
                        emailOptions.text = "Your Set price for crypto " + crypto.cryptoSymbol + " hit at " + new Date();
                        mailer.sendmail(emailOptions);
                        
                        //Delete this task after sending reminder
                        Crypto.deleteOne({
                            _id: crypto._id
                        }).catch((e)=>{});
    
                        
                    }
                }).catch((e)=>{});
            });
        });
    });
}
module.exports = function(){
    // Scheduler keep calling sendmail function in every 5sec to check for new price hit data. 
    let startTime = new Date(Date.now());
    schedule.scheduleJob({ start: startTime, rule: '*/5 * * * * *' }, function () {
        sendmail();
    });
}