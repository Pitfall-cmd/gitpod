1.升级 Box-BoxV2
2.Proxy 从Box 到BoxV2的过程
三种方式： https://github.com/PatrickAlphaC/hardhat-upgrades-fcc  目录scripts/otherUpgradeExamples/ 下面 ，这里我们选择第二种来做
    1.自己手动部署proxy，手动升级upgrade
    2.作为hardhat用户 选择用hardhat-deploy内置的proxy来帮助我们upgrade，和自己手动upgrade是一样的
    3.使用openzepplin的hardhat插件来帮我们upgrade

步骤：创建完两个Box合约之后
1.创建一个管理员合约BoxProxyAdmin用于管理Proxy （https://docs.openzeppelin.com/contracts/4.x/api/proxy#ProxyAdmin

