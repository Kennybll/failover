try {
  require('dotenv').load();
  let wls = require("wlsjs");
  const nodemailer = require('nodemailer');
  const smtpTransport = require('nodemailer-smtp-transport');
  if (process.env.node && process.env.node !== "") {
    wls.api.setOptions({ url: process.env.node });
  } else {
    wls.api.setOptions({ url: 'wss://beta.whaleshares.net/wss' });
  }
  wls.config.set('address_prefix', 'WLS');
  wls.config.set('chain_id', 'de999ada2ff7ed3d3d580381f229b40b5a0261aec48eb830e540080817b72866');

  // The name of the witness we're watching.
  const witness_name = process.env.witness;
  // The active key of the witness' account.
  const active_key = process.env.active_key;
  // The public key for the backup server.
  const backup_key = process.env.backup_key;
  // The witness information url.
  const witness_link = process.env.witness_link;
  // The consensus variable for account creation fees.
  const account_creation_fee = process.env.account_creation_fee;
  // The consensus variable for the maximum block size.
  const maximum_block_size = parseInt(process.env.maximum_block_size);
  // The threshold, or the amount of missed blocks to then switch witness nodes.
  let threshold = parseInt(process.env.threshold);
  // The seconds between checks for missed blocks.
  const check_rate = parseInt(process.env.check_rate);
  // Email to send notifications to.
  const email = process.env.email;
  // Password to your email for nodemailer.
  const password = process.env.password;
  const props = {
    account_creation_fee,
    maximum_block_size
  };

  function updateWitness() {
    console.log("Missed Block, Changing Servers");
    nodemailer.createTestAccount((err, account) => {
      let transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: email,
          pass: password
        }
      }));
      let mailOptions = {
        from: `"${email}"`,
        to: `"${email}"`,
        subject: 'You missed a block, switching servers',
        text: `You missed a block at ${new Date(Date.now()).toString()}`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          throw new Error(error);
        }
      });
    });
    wls.api.getWitnessByAccount(witness_name, function (err, res) {
      if (err) throw new Error(err);
      if (res.signing_key === 'WLS1111111111111111111111111111111114T1Anm') process.exit();
      if (backup_key === res.signing_key) wls.broadcast.witnessUpdate(active_key, witness_name, witness_link, 'WLS1111111111111111111111111111111114T1Anm', props, "0.000 WLS", function (err, res) {
        if (err) {
          throw new Error(err);
        }
      });
      else wls.broadcast.witnessUpdate(active_key, witness_name, witness_link, backup_key, props, "0.000 WLS", function (err, res) {
        if (err) {
          throw new Error(err);
        }
        threshold += 2;
      });
    });
  }

  function checkWitness() {
    wls.api.getWitnessByAccount(witness_name, function (err, res) {
      if (err) {
        throw new Error(err);
      } else {
        console.log('Total Missed = ' + res.total_missed);
        if (res.total_missed >= threshold) {
          updateWitness();
        }
      }
    })
  }

  checkWitness();
  setInterval(checkWitness, check_rate * 1000);

} catch (err) {
  throw new Error(err);
  process.exit();
}