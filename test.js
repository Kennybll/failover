try {
  require('dotenv').load();
  let wls = require("wlsjs");
  if (process.env.node && process.env.node !== "") {
    wls.api.setOptions({ url: process.env.node });
  } else {
    wls.api.setOptions({ url: 'wss://beta.whaleshares.net/wss' });
  }
  wls.config.set('address_prefix', 'WLS');
  wls.config.set('chain_id', 'de999ada2ff7ed3d3d580381f229b40b5a0261aec48eb830e540080817b72866');
  
  wls.api.getWitnessByAccount(process.env.witness, function (err, res) {
    console.log(err, res);
  })
} catch (err) {
  throw new Error(err);
}