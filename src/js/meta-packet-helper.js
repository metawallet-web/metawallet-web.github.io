

//var lavaWalletABI = require('../contracts/LavaWallet.json')
//var _0xBitcoinABI = require('../contracts/_0xBitcoinToken.json')
//var permissibleTokenABI = require('../contracts/PermissibleToken.json')

//var tokenData = require('../config/token-data.json')
//var defaultTokens = require('../config/default-tokens.json')

var defaultTokenData;

//var deployedContractInfo = require('../contracts/DeployedContractInfo.json')
var lavaWalletContract;
var _0xBitcoinContract;


export default class MetaPacketHelper {

  static serializePacketData (obj, prefix) {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }


  static async sendLavaPacket(relayNodeURL, metaPacketData)
  {


      if(!relayNodeURL.startsWith("http://"))
      {
        relayNodeURL = "http://"+relayNodeURL;
      }

      if(!relayNodeURL.endsWith("/lavapacket"))
      {
        relayNodeURL = relayNodeURL+"/lavapacket";
      }

      return new Promise(async resolve => {

        var xhr = new XMLHttpRequest();

        xhr.open('POST', relayNodeURL);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
           
              if (xhr.status === 200  ) {

                var response = JSON.parse(xhr.responseText);
                 console.log('successful', response);
                 resolve({gotReply:true, packet: metaPacketData, response: response})
              } else {
                 console.log('failed');
                 resolve({gotReply:false, message: 'Request failed.  Returned status of ' + xhr.status});

              }
          }
        }

        xhr.send(MetaPacketHelper.serializePacketData( metaPacketData ));

      })


  }



  static async sendPermitPacket(relayNodeURL, metaPacketData)
  {


      if(!relayNodeURL.startsWith("http://"))
      {
        relayNodeURL = "http://"+relayNodeURL;
      }

      if(!relayNodeURL.endsWith("/permitpacket"))
      {
        relayNodeURL = relayNodeURL+"/permitpacket";
      }

      return new Promise(async resolve => {

        var xhr = new XMLHttpRequest();

        xhr.open('POST', relayNodeURL);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            //var response = JSON.parse(xhr.responseText);
              if (xhr.status === 200  ) {
                 console.log('successful');
                 resolve({success:true, packet: metaPacketData})
              } else {
                 console.log('failed');
                 resolve({success:false, message: 'Request failed.  Returned status of ' + xhr.status});

              }
          }
        }

        xhr.send(MetaPacketHelper.serializePacketData( metaPacketData ));

      })


  }


}
