## Vscode 的一些配置与快捷键

1.VSCode 的一些简单配置：安装插件 hardhat 版的 solidity，然后还有 prettier
2.ctrl shift p -> open settings ,找到 format on save 打上钩
3.ctrl shift p-> open user setttings ，对于特定语言你想用特定的格式化方法，例子：

```json
{
  "redhat.telemetry.enabled": true,
  "hardhat.telemetry": true,
  "[solidity]": {
    "editor.defaultFormatter": "NomicFoundation.hardhat-solidity"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.formatOnSave": true
}
```

4.手动 format 也是 ctrl shift p —> format document
5 ctrl +p 搜索文件 ，ctrl shift p 执行命令行 ，用 ctrl shift v 可以查看你的 md 文件预览

## 正文分割线

0.node deploy.js 来运行 js

1.安装 nodejs

2.输入 corepack enable 安装 yarn

3.yarn add solc 安装编译器 4.如果更新编译器版本 就输入 yarn add solc@0.8.7-fixed （后面是具体的版本编号然后加上-fixed ，具体的版本编号可以去 github 上看发布的 tag

5.如果要随时随地使用 solcjs ，你需要 yarn global add solc@0.8.7-fixed ，否则 你只能在该文件夹内使用 yarn solcjs --verison 的方式来使用 CLI，yarn 会自动去在这个文件夹下搜索 solcjs

6.yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol 7.我们不想每次都输入这么这么长的一串来编译，所以在 package.json 里面输入

```json
  "scripts": {
    "complie":"yarn solcjs --bin --abi --include-path node_modules/ --base-path . -o . SimpleStorage.sol "
  }
```

然后直接输入 yarn compile 就行了

8、视频介绍了一下虚拟区块链 ganache ，然后 json-rpc of EVM，但是我们不想自己写。所以使用 etherjs 来写。

9、yarn add ethers

10、见代码

11.格式化 abi 文件，可以先改成 json 文件，然后 ctrl shift p ，输入 fortmat document with ，然后选一个就行 12.由于 rpc 服务者和 privatekey 都是硬编码 ，所以我们需要写入.env 文件 意思就是 environment variable ,然后使用 yarn add dotenv ，require("dotenv").config(); 自动写入环境变量，否则我们需要手动 export PRIVATE_KEY=XXXXXX , 查看则是 echo $PRIVATE_KEY

13 .gitignore 中加入 .env node_modules 来不要提交这些文件或文件夹

14.私钥管理，我们不想私钥直接白白的存储在.env 上，我们想加密一下,见 encryptKys.js,然后通过加密后的 json 生成 wallet，再连接到 provider

15.自定义 format 格式 yarn add prettier prettier-plugin-solidity ,然后创建 .prettierrc 文件 ，里面写入你想要的格式

16.用 ctrl shift v 可以查看你的 md 文件预览

17 部署测试网 通过 alchemy 作为测试网提供商
