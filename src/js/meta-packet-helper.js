

//var lavaWalletABI = require('../contracts/LavaWallet.json')
//var _0xBitcoinABI = require('../contracts/_0xBitcoinToken.json')
//var permissibleTokenABI = require('../contracts/PermissibleToken.json')

//var tokenData = require('../config/token-data.json')
//var defaultTokens = require('../config/default-tokens.json')

import { io } from "socket.io-client";


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


 //:8443  wss://localhost:8443
 //ws://127.0.0.1:8443

 // ws://157.230.93.59:8443
 // wss://apexrelay.com:8443

  static async sendLavaPacket(relayNodeURL, metaPacketData)
  {

    

      

      return new Promise(async resolve => {

        //const socket = io("https://server-domain.com");

        const socket = io( relayNodeURL );

        
        socket.emit("lavaPacket", {packet: metaPacketData} );


        socket.on("lavaPacket",(data) => {
          console.log('got back',data)
          resolve(data)
        });

       

      })


  }



  static async sendPermitPacket(relayNodeURL, metaPacketData)
  {


    return new Promise(async resolve => {

      //const socket = io("https://server-domain.com");

      const socket = io( relayNodeURL );

      
      socket.emit("permitPacket", {packet: metaPacketData} );
      


      socket.on("permitPacket",(data) => {
        console.log('got back',data)
        resolve(data)
      });

    })

  }


}
