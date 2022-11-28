1.yarn global add hardhat-shorthand ,全局安装快捷输入,安装之后 你输入 hh 就行了
1.1 注意 contracts 文件夹不要漏写 s

2.然后就是如何操作 VRF https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number
2.1 创一个 subscriptionId，然后让往这个 id 里面添加 fund link，然后对这个 id 添加你的消费函数，每一次调用消费，就从 id 对应的 link 账户扣。

3.然后是创建自动去执行合约 Automation(keeper) https://docs.chain.link/chainlink-automation/compatible-contracts/

4.部署 mock，导入一下，然后编译

5.部署 raffle //https://www.npmjs.com/package/hardhat-deploy?activeTab=readme
5.0 部署中用到 getNamedAccounts ，deployments 都是来自 hardhat-deploy，注入到 hardhat 里面去了。

5.1 其中传入参数中 subscripitonId，如果不是测试网则需要手动去调用 mock 的函数，并通过 event 获得，然后手动给此 id 传入 fund。此外直接去网站上获得 id，并且转入 fund。
5.2 获得 event 的方式 transactionReceipt.events[0].args.subId //获得 event 的方式 0 代表该交易中的第 1 个 event，一个函数可能触发多个 event
https://www.youtube.com/watch?v=KDYJC85eS5M https://github.com/PatrickAlphaC/hardhat-events-logs

6. vrfCoordinatorV2Mock = await deployments.get("VRFCoordinatorV2Mock")//这个 能调用 address，不能调用函数
   vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock") //使用这个能调用合约的函数，上面的则不行，第二参数不加默认是部署合约的账户，加了就是用当前的账户 signer 去获得合约。

7.测试 event 是否 emit https://ethereum-waffle.readthedocs.io/en/latest/matchers.html?highlight=event#emitting-events

8.测试一些需要 blocktime 经过一些时间的任务 ，可以用//需要经过 interval 秒之后才能调用 performCheckup 所以手动调用 evm_increase，// for a documentation of the methods below, go here: https://hardhat.org/hardhat-network/reference，await network.provider.send("evm_increaseTime", [interval.toNumber() + 1])

9.测试的时候 callStatic 针对不修改区块链的方法，const { upkeepNeeded } = await raffle.staticCall.checkUpkeep([]) ，可以获得函数返回值，
9.1 但是如果针对的是修改区块链的方法，不是 view 的方法，返回的就是一个交易 tx

10.给函数传一个空的 bytes 的时候，你可以传一个 []也可以传"0x"，

11.写监听器的时候要注意顺序 ，先写监听器

12.现网测试 第一步 1。得到 subscriptionId ，第二步 把这个 id 部署的时候传入到你的合约，第三步，在线把你的合约地址，添加到你的 id 下面，就可以使用了，注意往里面加 fund 13.然后去 automation 这个 keeper 那里，传入你需要被自动调用的合约地址和他的 abi，然后设置一系列的时间，最后确保你有 link 可以转入。做完这些操作可以去去 raffle.staging.test 了

14.如果你发起的交易改变了区块上的内容，那你接下来读取数据最好等一个 block！！！否则会错的。因为 await 某个操作，只是发起了交易，并且交易验证过了，加入到交易池里面，并没有立马挖矿上区块，所以此时你不等 wait(1)，立马读取你的区块链数据，会大概率有错误，比我我转账发起了交易 1eth，然后没等一个区块，立即读自己的 getbalance，此时的值还是原先的，因为先前的交易没有真正写入区块。

15.自动机合约->raffle->VRF合约    VRF->raffle
