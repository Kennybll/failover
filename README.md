# Witness Failover Script for WS

## Setup
1. Clone this repository, or download it
2. Install Node.JS
3. Copy .1.env to .env
4. Open .env with a text editor
5. Enter you information
  a. witness = Your witness username
  b. active_key = Your active key to your witness account
  c. backup_key = The public key corresponding to the backup witness node
  d. witness_link = The witness proposal link for update witness
  e. account_creation_fee = The consensus value for update witness
  f. maximum_block_size = The consensus value for update witness
  g. check_rate = How many seconds before checking missed blocks
  h. threshold = The amount of missed blocks before it switches servers
  i. email = A gmail account for missed block notification
  j. password = Password to the corresponding email
  k. node = The Whaleshares RPC node to connect to
6. Run ```npm install```
7. Run ```npm i -g pm2```
8. Run ```sudo pm2 start index.js --name failover```

## Email Setup
You **must** use a gmail for email notifications. You have to enter your email address and password for it to send from that email to the email.
You may need to enable [this](https://myaccount.google.com/lesssecureapps) and [this](https://accounts.google.com/b/0/DisplayUnlockCaptcha).

## How It Works
Once you go over or meet your threshold (must be set each time), the script will update your witness to use your backup node. If you miss two more blocks it will disable your witness, until you reset the script. After you miss all three blocks the script will terminate, and you will have to reset your threshold, and restart the script with ```sudo pm2 restart failover```

## See Your Missed Blocks
To see how many blocks you've missed do ```node test.js``` and it will output your account details. Look for total_missed. You'll want to put a threshold higher than this. Or for testing set it equal, or less than the total_missed.

## Free To Use
This is free to use, and if you have any suggestions please contact me on discord at @kennybll#3044 or on telegram as @kennybll. You can, if you wish, donate to https://whaleshares.io/@kennybll as well. Any support can also be sent to my discord or telegram. Thanks and I hope this helps the witnesses!