// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "base64-sol/base64.sol";
error ERC721Metadata__URI_QueryFor_NonExistentToken();

contract DynamicSvgNft is ERC721 {
  uint256 private s_tokenCounter;
  string private s_lowImageURI;
  string private s_highImageURI;
  string private constant base64EncodeedSvgPrfix = "data:image/svg+xml;base64,";
  AggregatorV3Interface internal immutable i_priceFeed;
  mapping (uint => int256) s_tokenIdToHighValues;
  event CreatedNFT(uint256 indexed tokenId, int256 highValue);

  constructor(
    address priceFeedAddress,
    string memory lowSvg,
    string memory highSvg
  ) ERC721("Dynamic SVG NFT", "DSN") {
    s_lowImageURI = svgToImageURI(lowSvg);
    s_highImageURI = svgToImageURI(highSvg);
    i_priceFeed = AggregatorV3Interface(priceFeedAddress);
  }

  function mintNft(int256 highValue) public {
    s_tokenIdToHighValues[s_tokenCounter] = highValue;
    _safeMint(msg.sender, s_tokenCounter);
    s_tokenCounter = s_tokenCounter + 1;
    emit CreatedNFT(s_tokenCounter, highValue);
  }

  function svgToImageURI(
    string memory svg
  ) public pure returns (string memory) {
    //  '<svg width="500" height="500" viewBox="0 0 285 350" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill="black" d="M150,0,L75,200,L225,200,Z"></path></svg>'

    string memory svgBase64Encoded = Base64.encode(
      bytes(string(abi.encodePacked(svg)))
    );
    //下面的abi.encodePacked其实就是合并字符串的操作 也可以用string.concat(base64EncodeedSvgPrfix，svgBase64Encoded)
    return string(abi.encodePacked(base64EncodeedSvgPrfix, svgBase64Encoded));
  }

  function _baseURI() internal pure override returns (string memory) {
    return "data:application/json;base64,";
  }

  function tokenURI(uint tokenId) public view override returns (string memory) {
    if (!_exists(tokenId)) {
      revert ERC721Metadata__URI_QueryFor_NonExistentToken();
    }
    (, int256 price, , , ) = i_priceFeed.latestRoundData();
    string memory imageURI = s_lowImageURI;
    if (price >= s_tokenIdToHighValues[tokenId]) {
      imageURI = s_highImageURI;
    }
    return
      string(
        abi.encodePacked(
          _baseURI(),
          Base64.encode(
            bytes(
              abi.encodePacked(
                '{"name":"',
                name(), // You can add whatever name here
                '", "description":"An NFT that changes based on the Chainlink Feed", ',
                '"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
                imageURI,
                '"}'
              )
            )
          )
        )
      );
  }
}
