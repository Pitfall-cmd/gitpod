1. deposite collateral 质押抵押品 ETH/WETH ,由于所有交易都是token之间进行的在defi里面，所以有了Weth wrapped eth，来带代表eth的token goerli:https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6 mainnet: https://etherscan.io/address/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
2. Borrow another asset ：DAI
3. Repay the DAI

4.分叉网络，复制主网到本地环境进行测试 https://hardhat.org/hardhat-network/docs/guides/forking-other-networks ,配置完之后，意味着你可以直接与主网上的合约交互，但不会改变主网。

5.getWeth 来获得我们的weth数量

6.操作AAVE
6.1 先获得LendingPoolAddressesProvider的地址和接口， https://docs.aave.com/developers/v/2.0/the-core-protocol/addresses-provider
6.2 LendingPool 需要通过上面的provider来获得 ，你网上只能获得他的接口用作abi  https://docs.aave.com/developers/v/2.0/the-core-protocol/lendingpool/ilendingpool
6.3 复制LendingPool.sol，里面的内容需要引入别的sol，所以yarn add @aave/protocol-v2   https://www.npmjs.com/package/@aave/protocol-v2 ,然后修改为 
import {ILendingPoolAddressesProvider} from '@aave/protocol-v2/contracts/interfaces/ILendingPoolAddressesProvider.sol';
import {DataTypes} from '@aave/protocol-v2/contracts/protocol/libraries/types/DataTypes.sol';
6.4