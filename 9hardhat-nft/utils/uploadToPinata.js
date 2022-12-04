const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
const pinataApiKey = process.env.PINATA_API_KEY || ""
const pinataApiSecret = process.env.PINATA_API_SECRET || ""
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret)
async function storeImages(imageFilePath) {
  const fullImagePath = path.resolve(imageFilePath) //要以项目的根目录开始，而不是你当前文件的相对目录
  //console.log(fullImagePath) ///workspaces/gitpod/9hardhat-nft/images/randomNft
  const files = fs.readdirSync(fullImagePath)
  //console.log(files) // [ 'pug.png', 'shiba-inu.png', 'st-bernard.png' ]
  let responses = []
  for (const fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(
      `${fullImagePath}/${files[fileIndex]}`
    )
    const options = {
      pinataMetadata: {
        name: files[fileIndex],
      },
    }
    console.log(`working on ${fullImagePath}/${files[fileIndex]}...`)
    try {
      const response = await pinata.pinFileToIPFS(
        readableStreamForFile,
        options
      )
      responses.push(response)
      console.log(response)
    } catch (error) {
      console.error(error)
    }
  }
  return { responses, files }
}
async function storeTokenUriMetadata(metadata) {
  const options = {
    pinataMetadata: {
      name: metadata.name,
    },
  }
  try {
    const response = await pinata.pinJSONToIPFS(metadata, options)
    return response
  } catch (error) {
    console.log(error)
  }
  return null
}
module.exports = { storeImages,storeTokenUriMetadata }
