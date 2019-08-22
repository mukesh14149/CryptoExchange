1. npm install 

2. Set environment variable for email and pass for sending email
ubuntu cmd 
export cryptoEmailId=youremail@domain.com
export cryptoEmailPassword='yourpassword'

3. npm start

##Modules
1. User Api contains:-
   Login -> user login through this api
   Register -> user register through this api
   confirmemail -> email can be verify through this link


2. Crypto Api contains:-
   set -> user can set a reminder for any cryptosymbol
   update -> user can update its reminder list
   delete -> user can delete its reminder list
   getallcryptosymbol -> get all cryptocurrency symbol name and its current price
   getcryptolist -> get list of all reminders he set

##Services
1. binance- 
	Used to create wss connection to binance server to get price list for all symbol when it update and then from given data check for price match if the crypto price hit the set price then update the db with the pricehit time and on ther other side scheduler will send the email.

2. scheduler- runs in each 5 secs, it will fetch data from db for those user whos symbol price just hit to the set price and send email to those user.
3. sendEmail- service to send an email



