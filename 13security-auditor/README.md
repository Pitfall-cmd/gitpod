1.pip3 install slither-analyzer   安装 检测安全工具Slither https://github.com/crytic/slither#how-to-install
2. 如果你的合约需求的solodity的版本比较奇怪 安装 pip3 install solc-select ；然后solc-select use 0.8.7  https://github.com/crytic/solc-select
3. 运行 slither --help 判断是否安装成功 
4.我们在package.json 里面写了一个 scripts 来简化
```json
"scripts": {
    "slither": "slither . --solc-remaps '@openzeppelin=node_modules/@openzeppelin @chainlink=node_modules/@chainlink' --exclude naming-convention,external-function,low-level-calls",
  }
```
5.运行yarn slither