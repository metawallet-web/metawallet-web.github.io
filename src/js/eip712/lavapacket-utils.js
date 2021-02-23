/*
LAVA PACKET UTIL for NODEJS
javascript library for NODEJS

Version 0.10

*/
import EIP712HelperV3 from "./EIP712HelperV3" 
var web3utils = require('web3-utils')

var sampleLavaPacket = {
  method: "transfer",
  from: "0xb11ca87e32075817c82cc471994943a4290f4a14",
  relayAuthority: "0x0000000000000000000000000000000000000000",
  to: "0x357FfaDBdBEe756aA686Ef6843DA359E2a85229c",
  walletAddress:"0x1d0d66272025d7c59c40257813fc0d7ddf2c4826",
  tokenAddress:"0x9d2cc383e677292ed87f63586086cff62a009010",
  tokenAmount:200000000,
  relayerReward:100000000,
  expires:3365044,
  nonce:0xc18f687c56f1b2749af7d6151fa351,
  signature:"0x0" //fix
}


export default class LavaPacketUtils {






    static getLavaPacket(
      method,relayAuthority,from,to,walletAddress,tokenAddress,tokenAmount,
      relayerReward,expires,nonce,signature)
    {

      return {
        method:method,
        relayAuthority: relayAuthority,
        from: from,
        to: to,
        walletAddress:walletAddress,
        tokenAddress:tokenAddress,
        tokenAmount:tokenAmount,
        relayerReward:relayerReward,
        expires:expires,
        nonce:nonce,
        signature:signature
      }


    }

    static generateRandomNonce( ){
      return web3utils.randomHex(16)
    }

    /*static lavaPacketHasValidSignature(packetData){

      var sigHash = LavaPacketUtils.getLavaTypedDataHash(packetData.method, packetData.relayAuthority, packetData.from,packetData.to,packetData.walletAddress,packetData.tokenAddress,packetData.tokenAmount,packetData.relayerReward,packetData.expires,packetData.nonce);


      var msgBuf = ethjsutil.toBuffer(packetData.signature)
      const res = ethjsutil.fromRpcSig(msgBuf);


      var hashBuf = ethjsutil.toBuffer(sigHash)

      const pubKey  = ethjsutil.ecrecover(hashBuf, res.v, res.r, res.s);
      const addrBuf = ethjsutil.pubToAddress(pubKey);
      const recoveredSignatureSigner    = ethjsutil.bufferToHex(addrBuf);


      //make sure the signer is the depositor of the tokens
      return packetData.from.toLowerCase() == recoveredSignatureSigner.toLowerCase();

    }*/

    /*  static getLavaTypedDataHash(method,relayAuthority,from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
      {
        var  hardcodedSchemaHash =  LavaPacketUtils.getLavaPacketSchemaHash();

         nonce = web3utils.toBN(nonce)

          var typedDataHash = web3utils.soliditySha3(
                        hardcodedSchemaHash,
                        web3utils.soliditySha3(method,from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
                        );


        return typedDataHash;
      }*/

      static getLavaTypedDataHash(typedData )
      {
        var typedDataHash = web3utils.sha3(
            Buffer.concat([
                Buffer.from('1901', 'hex'),
                EIP712HelperV3.structHash('EIP712Domain', typedData.domain, typedData.types),
                EIP712HelperV3.structHash(typedData.primaryType, typedData.message, typedData.types),
            ]),
        );

        console.log('meep 1', EIP712HelperV3.structHash('EIP712Domain', typedData.domain, typedData.types))
        console.log('meep 2', EIP712HelperV3.structHash(typedData.primaryType, typedData.message, typedData.types))
        return typedDataHash;
      }


     static getLavaPacketSchemaHash()
     {
        var hardcodedSchemaHash = '0x8fd4f9177556bbc74d0710c8bdda543afd18cc84d92d64b5620d5f1881dceb37' ;
        return hardcodedSchemaHash;
     }


     static recoverLavaPacketSigner(  typedData, signature){

       var sigHash = LavaPacketUtils.getLavaTypedDataHash( typedData, typedData.types);
       var msgBuf = ethUtil.toBuffer(signature)
       const res = ethUtil.fromRpcSig(msgBuf);


       var hashBuf = ethUtil.toBuffer(sigHash)

       const pubKey  = ethUtil.ecrecover(hashBuf, res.v, res.r, res.s);
       const addrBuf = ethUtil.pubToAddress(pubKey);
       const recoveredSignatureSigner    = ethUtil.bufferToHex(addrBuf);

       var message = typedData.message

       console.log('recovered signer pub address',recoveredSignatureSigner.toLowerCase())
       //make sure the signer is the depositor of the tokens
       return recoveredSignatureSigner.toLowerCase();

     }




     static signTypedData(privateKey, msgParams)
    {

      const msgHash = ethSigUtil.typedSignatureHash(msgParams.data)
      console.log('msghash1',msgHash)

      var msgBuffer= ethUtil.toBuffer(msgHash)

      const sig = ethUtil.ecsign(msgBuffer, privateKey)
      return ethUtil.bufferToHex(ethSigUtil.concatSig(sig.v, sig.r, sig.s))

    }


    static getLavaTypedDataFromParams( _chainId,  methodName,relayAuthority,from,
      to,walletAddress,tokenAddress, tokenAmount, relayerRewardTokens,expires,nonce )
    {
      const typedData = {
              types: {
                  EIP712Domain: [
                      { name: "contractName", type: "string" },
                      { name: "version", type: "string" },
                      { name: "chainId", type: "uint256" },
                      { name: "verifyingContract", type: "address" }
                  ],
                  LavaPacket: [
                      { name: 'methodName', type: 'bytes' },
                      { name: 'relayAuthority', type: 'address' },
                      { name: 'from', type: 'address' },
                      { name: 'to', type: 'address' },
                      { name: 'wallet', type: 'address' },
                      { name: 'token', type: 'address' },
                      { name: 'tokens', type: 'uint256' },                    
                      { name: 'relayerRewardTokens', type: 'uint256' },
                      { name: 'expires', type: 'uint256' },
                      { name: 'nonce', type: 'uint256' }
                  ],
              },
              primaryType: 'LavaPacket',
              domain: {
                  contractName: 'Lava Wallet',
                  version: '1',
                  chainId: _chainId,  
                  verifyingContract: web3utils.toChecksumAddress(walletAddress)
              },
              message: {
                  methodName: methodName,
                  relayAuthority: relayAuthority,
                  from: web3utils.toChecksumAddress(from),
                  to: web3utils.toChecksumAddress(to),
                  wallet: web3utils.toChecksumAddress(walletAddress),
                  token: web3utils.toChecksumAddress(tokenAddress),
                  tokens: (tokenAmount),
                  relayerRewardTokens: (relayerRewardTokens),
                  expires: expires,
                  nonce: nonce
              }
          };





        return typedData;
    }

  /*   static getLavaParamsFromData(method,relayAuthority,from,to,walletAddress,tokenAddress,tokenAmount,relayerReward,expires,nonce)
     {
         var params = [

          {
            type: 'bytes',
            name: 'method',
            value: method
          },
          {
            type: 'address',
            name: 'relayAuthority',
            value: relayAuthority
          },
           {
             type: 'address',
             name: 'from',
             value: from
           },
           {
             type: 'address',
             name: 'to',
             value: to
           },
           {
             type: 'address',
             name: 'walletAddress',
             value: walletAddress
           },
           {
             type: 'address',
             name: 'tokenAddress',
             value: tokenAddress
           },
           {
             type: 'uint256',
             name: 'tokenAmount',
             value: tokenAmount
           },
           {
             type: 'uint256',
             name: 'relayerReward',
             value: relayerReward
           },
           {
             type: 'uint256',
             name: 'expires',
             value: expires
           },
           {
             type: 'uint256',
             name: 'nonce',
             value: nonce
           },
         ]

         return params;
     }
*/




      static formatAmountWithDecimals(amountRaw,decimals)
      {
      var amountFormatted = amountRaw / (Math.pow(10,decimals) * 1.0)

    //  amountFormatted = Math.round(amountFormatted,decimals)

      return amountFormatted;
    }




      /*  static getContractLavaMethod(walletContract,packetData)
        {

          var lavaTransferMethod;


          if(packetData.method == 'transfer')
          {
            lavaTransferMethod = walletContract.methods.transferTokensFromWithSignature(
             packetData.from,
             packetData.to,
             packetData.tokenAddress,
             packetData.tokenAmount,
             packetData.relayerReward,
             packetData.expires,
             packetData.nonce,
             packetData.signature
           );
         }else if(packetData.method == 'withdraw')
          {
            lavaTransferMethod = walletContract.methods.withdrawTokensFromWithSignature(
             packetData.from,
             packetData.to,
             packetData.tokenAddress,
             packetData.tokenAmount,
             packetData.relayerReward,
             packetData.expires,
             packetData.nonce,
             packetData.signature
           );
         }else if(packetData.method == 'approve')
         {
           lavaTransferMethod = walletContract.methods.approveTokensWithSignature(
            packetData.from,
            packetData.to,
            packetData.tokenAddress,
            packetData.tokenAmount,
            packetData.relayerReward,
            packetData.expires,
            packetData.nonce,
            packetData.signature
          );
        }else
        {
          lavaTransferMethod = walletContract.methods.approveAndCall(
           packetData.method,
           packetData.from,
           packetData.to,
           packetData.tokenAddress,
           packetData.tokenAmount,
           packetData.relayerReward,
           packetData.expires,
           packetData.nonce,
           packetData.signature
         );
        }

          return lavaTransferMethod;

        }
*/

        static getFunctionCall(web3,packetData)
        {

              const TransferMethodBytes = '0x7472616e73666572'

          var txData;


          if(packetData.method == TransferMethodBytes)
          {
            txData  = web3.eth.abi.encodeFunctionCall({
                      name: 'transferTokensFromWithSignature',
                      type: 'function',
                      "inputs": [
                        {
                          "name": "from",
                          "type": "address"
                        },
                        {
                          "name": "to",
                          "type": "address"
                        },
                        {
                          "name": "token",
                          "type": "address"
                        },
                        {
                          "name": "tokens",
                          "type": "uint256"
                        },
                        {
                          "name": "relayerReward",
                          "type": "uint256"
                        },
                        {
                          "name": "expires",
                          "type": "uint256"
                        },
                        {
                          "name": "nonce",
                          "type": "uint256"
                        },
                        {
                          "name": "signature",
                          "type": "bytes"
                        }
                      ]
                  }, [
                      packetData.from,
                      packetData.to,
                      packetData.tokenAddress,
                      packetData.tokenAmount,
                      packetData.relayerReward,
                      packetData.expires,
                      packetData.nonce,
                      packetData.signature
                ]);

         }else  
          {
            txData  = web3.eth.abi.encodeFunctionCall({
                      name: 'transferAndCallFromWithSignature',
                      type: 'function',
                      "inputs": [
                        {
                          "name": "from",
                          "type": "address"
                        },
                        {
                          "name": "to",
                          "type": "address"
                        },
                        {
                          "name": "token",
                          "type": "address"
                        },
                        {
                          "name": "tokens",
                          "type": "uint256"
                        },
                        {
                          "name": "relayerReward",
                          "type": "uint256"
                        },
                        {
                          "name": "expires",
                          "type": "uint256"
                        },
                        {
                          "name": "nonce",
                          "type": "uint256"
                        },
                        {
                          "name": "signature",
                          "type": "bytes"
                        }
                      ]
                  }, [
                      packetData.from,
                      packetData.to,
                      packetData.tokenAddress,
                      packetData.tokenAmount,
                      packetData.relayerReward,
                      packetData.expires,
                      packetData.nonce,
                      packetData.signature
                ]);

         } 


              return txData;
        }



        //updating to spec
        // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md

        //https://github.com/ethereum/EIPs/blob/master/assets/eip-712/Example.sol

      static getEIP712TypedData()
      {

        return {
          type: 'object',
          properties: {
            types: {
              type: 'object',
              properties: {
                EIP712Domain: {type: 'array'},
              },
              additionalProperties: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: {type: 'string'},
                    type: {type: 'string'}
                  },
                  required: ['name', 'type']
                }
              },
              required: ['EIP712Domain']
            },
            primaryType: {type: 'string'},
            domain: {type: 'object'},
            message: {type: 'object'}
          },
          required: ['types', 'primaryType', 'domain', 'message']
        }



      }



      static async performOffchainSignForLavaPacket(args, web3Plug){

         
 
        

       let chainId = web3Plug.getConnectionState().activeNetworkId
 
 
 
       const typedData = LavaPacketUtils.getLavaTypedDataFromParams(
             
            chainId,  //0x2a for Kovan
             
            ...Object.values(  args )  //unpack the args 
       )
        console.log('lavapacket  typedData',typedData)
 
        var stringifiedData = JSON.stringify(  typedData );

        

        let signResult = await  EIP712HelperV3.signTypedData( web3Plug.web3, args.from, stringifiedData  )
        
        
        
        console.log( 'signResult', signResult )  

        return signResult



  }

}
