1.扩展下载 live server
2. 确保metamask 插件存在，可以通过判断 typeof window.ethereum !=="undefined" 因为metamask等插件都会自动注入这些window obejct
2.1 https://docs.metamask.io/guide/getting-started.html#basic-considerations
2.2 连接metamask
2.3 去ether doc上看web页面的ethers如何import，因为前端不能用yarn add 所以需要手动复制ethers的文件

3.然后正常的获得provider，连接signer，获得合约，调用方法
3.1你要切换到本地网络，如果你是gitpod 则需要看一下terminal旁边的ports
4.注意如果提示nonce不正确 ，你需要在metamask里面 setting->advanced ->reset accounts

5.promise 里面的参数 resolve和reject是两个函数，只有当触发了这两个函数中的一个，才会await结束。resolve是表明你的函数正常运行，reject则是相反