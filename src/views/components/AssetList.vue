<template>
     <div id="asset-list" class="asset-list bg-gray-400 px-8">
             
            <table class="table-auto w-full text-black">
              <thead>
                <tr class="  text-black font-bold border-b-2 border-black">
                  <td class="has-text-centered"> Icon </td>
                  <td class="has-text-centered"> Name </td>
                  <td class="has-text-centered"> Balance </td>
                  <td class="has-text-centered"> Approved </td>
                </tr>
              </thead>
              <tbody >
              <tr    v-for="(item, index) in tokenDataArray" v-bind:data-tokenaddress="item.address" 
                @click="clickedAsset(item)"
                class="hover:bg-gray-200 cursor-pointer select-none"
                >


                <td class="row-cell has-text-centered icon-url py-6"><img  v-bind:src="item.imgurl" height="42" width="42" ></img></td>
                <td class="row-cell has-text-centered token-name">{{item.name}}</td>
                  <td class="row-cell has-text-centered"><div class="has-text-centered token-balance">{{item.balance_formatted}}</div>  </td>
    <td class="row-cell has-text-centered"><div class="has-text-centered token-balance">{{item.approved_formatted}}</div>  </td>
 
              </tr>
            </tbody>
            </table>

           </div>
</template>

<script>

 
const tokenList = require('../../config/token-list.json')

const permissibleTokenABI = require('../../abi/PermissibleToken.json')

var updateInterval;

export default {
    name: 'AssetList',
    props:['networkName','web3Plug','onSelectedAssetCallback'],
  data() {
    return {
      tokenDataArray:[]
    }
  },
   mounted(){
       updateInterval = setInterval(this.update.bind(this), 5000);
       this.updateTokenArray()
  },


  destroyed(){
    clearInterval(updateInterval)
  },

  methods: {
    update(){

      this.updateTokenArray()
    },

    async updateTokenArray(){ 
 

       let tokens = tokenList.networks[this.networkName]

       let contractData = this.web3Plug.getContractDataForActiveNetwork() 


       let lavaWalletAddress = contractData['LavaWallet'].address
        


        let dataArrayCache = [] 
      



         let allAccounts = await this.web3Plug.getConnectedAccounts() 
        let primaryAddress =  this.web3Plug.web3.utils.toChecksumAddress( allAccounts[0] ) 

        let assetArray =   tokens.map(x =>  contractData[x] )
         

       for(let token  of assetArray){
          if(token == null ) continue

           let tokenFullData = Object.assign({},token)

         

         let tokenContract = this.web3Plug.getCustomContract(this.web3Plug.web3, permissibleTokenABI, token.address)

          let balance = await tokenContract.methods.balanceOf(primaryAddress).call({from:primaryAddress})

          tokenFullData.balance = balance
          tokenFullData.balance_formatted = balance

           let approved = await tokenContract.methods.allowance(primaryAddress,lavaWalletAddress).call({from:primaryAddress})

          tokenFullData.approved = approved
          tokenFullData.approved_formatted = approved

        dataArrayCache.push( tokenFullData )

       }

        this.tokenDataArray = Object.assign({},dataArrayCache)

 
     //  return tokenDataArray

    },
    clickedAsset(asset){
      this.onSelectedAssetCallback(asset)
    }
  }
}
</script>