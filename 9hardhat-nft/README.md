1.Basic NFT

2.Random IPFS NFT
添加 subID 和 add consumer 的操作在 deploy 里面进行
// 1.存到你自己的 IPFS node ，这是一种中心化的方式，如果别的节点不 pin 你的内容的话

    2.存在 Pinata 上面，至少有另一方把你的内容 Pin 下来了
        2.1 去网站上，注册好 获得api key ，然后使用他们的sdk来调用api，自动化的调用！ yarn add --dev @pinata/sdk
        2.2 yarn add path ，该path 包中的resolve方法可以获得你你文件的 绝对路径,注意resolve的参数是你的项目根路径开始的。
        2.3 部署完之后要写test
        2.4 对于expect中的emit和revertedWith ，函数外面写await 而不是参数里面写await 否则会报错
    3.存在 NFT.storage 上面，是一种完全的去中心化方式，用了 Filecoin

3.Dynamic SVG NFT (100% On chain)
    1.把svg的code存到链上需要先通过base64转化成为 imgURI (Base64 在万维网[1]上特别流行，其用途之一是能够将图像文件或其他二进制资产嵌入文本资产（如HTML和CSS文件）中。)
    2.网上搜 svg to base64 
    3.转化一张svg之后 得到如下
    ```base64
    PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHdpZHRoPSIxMDI0cHgiIGhlaWdodD0iMTAyNHB4IiB2aWV3Qm94PSIwIDAgMTAyNCAxMDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik01MTIgNjRDMjY0LjYgNjQgNjQgMjY0LjYgNjQgNTEyczIwMC42IDQ0OCA0NDggNDQ4IDQ0OC0yMDAuNiA0NDgtNDQ4Uzc1OS40IDY0IDUxMiA2NHptMCA4MjBjLTIwNS40IDAtMzcyLTE2Ni42LTM3Mi0zNzJzMTY2LjYtMzcyIDM3Mi0zNzIgMzcyIDE2Ni42IDM3MiAzNzItMTY2LjYgMzcyLTM3MiAzNzJ6Ii8+CiAgPHBhdGggZmlsbD0iI0U2RTZFNiIgZD0iTTUxMiAxNDBjLTIwNS40IDAtMzcyIDE2Ni42LTM3MiAzNzJzMTY2LjYgMzcyIDM3MiAzNzIgMzcyLTE2Ni42IDM3Mi0zNzItMTY2LjYtMzcyLTM3Mi0zNzJ6TTI4OCA0MjFhNDguMDEgNDguMDEgMCAwIDEgOTYgMCA0OC4wMSA0OC4wMSAwIDAgMS05NiAwem0zNzYgMjcyaC00OC4xYy00LjIgMC03LjgtMy4yLTguMS03LjRDNjA0IDYzNi4xIDU2Mi41IDU5NyA1MTIgNTk3cy05Mi4xIDM5LjEtOTUuOCA4OC42Yy0uMyA0LjItMy45IDcuNC04LjEgNy40SDM2MGE4IDggMCAwIDEtOC04LjRjNC40LTg0LjMgNzQuNS0xNTEuNiAxNjAtMTUxLjZzMTU1LjYgNjcuMyAxNjAgMTUxLjZhOCA4IDAgMCAxLTggOC40em0yNC0yMjRhNDguMDEgNDguMDEgMCAwIDEgMC05NiA0OC4wMSA0OC4wMSAwIDAgMSAwIDk2eiIvPgogIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0yODggNDIxYTQ4IDQ4IDAgMSAwIDk2IDAgNDggNDggMCAxIDAtOTYgMHptMjI0IDExMmMtODUuNSAwLTE1NS42IDY3LjMtMTYwIDE1MS42YTggOCAwIDAgMCA4IDguNGg0OC4xYzQuMiAwIDcuOC0zLjIgOC4xLTcuNCAzLjctNDkuNSA0NS4zLTg4LjYgOTUuOC04OC42czkyIDM5LjEgOTUuOCA4OC42Yy4zIDQuMiAzLjkgNy40IDguMSA3LjRINjY0YTggOCAwIDAgMCA4LTguNEM2NjcuNiA2MDAuMyA1OTcuNSA1MzMgNTEyIDUzM3ptMTI4LTExMmE0OCA0OCAwIDEgMCA5NiAwIDQ4IDQ4IDAgMSAwLTk2IDB6Ii8+Cjwvc3ZnPgo=
    ```
    4.浏览器里面输入 data:image/svg+xml;base64,上面的字符  即可访问到
    5.如果在链上进行base64的操作 需要 yarn add --dev base64-sol然后就可以使用了
    6.如果是IPFS，对应的步骤是hash（image）-》 hash（JSON），然后uri设置为 ipfs：//hash（JSON）
    6.1那么对应的base64 ，步骤为base64（image）-》base64（json） 然后uri设置为data:application/json;base64,


metadata 的JSON 模板
```json
{
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
}
```