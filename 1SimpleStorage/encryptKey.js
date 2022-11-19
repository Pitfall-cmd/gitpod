const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();
async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptJson = await wallet.encrypt(
    "ybl0147.",
    process.env.PRIVATE_KEY
  );
  console.log(encryptJson);
  fs.writeFileSync("./.encryptJson.json", encryptJson);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
