// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
error RandomIpfsNft__RangeOutOfBounds();
error RandomIpfsNft__NeedMoreETHSent();
error RandomIpfsNft__TransferFailed();

contract RandomIpfsNft is VRFConsumerBaseV2, ERC721URIStorage, Ownable {
  // Types 3种类
  enum Breed {
    PUG,
    SHIBA_INU,
    ST_BERNARD
  }
  //trigger a chainlink vrf to get a random number
  //using number get a random nft
  //users hae to pay to mint an NFT
  //owner of contract can withdraw the ETH
  VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
  uint64 private immutable i_subscriptionId;
  bytes32 private immutable i_gasLane;
  uint32 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;
  uint public s_tokenCounter;
  uint internal constant MAX_CHANCE_VALUE = 100;
  mapping(uint => address) public s_requestIdtoSender;
  string[] internal s_dogTokenUris;
  uint256 private immutable i_mintFee;
  // Events
  event NftRequested(uint256 indexed requestId, address indexed requester);
  event NftMinted(Breed breed, address minter);

  constructor(
    address vrfCoordinator,
    uint64 subscriptionId,
    bytes32 gasLane,
    uint256 mintFee,
    uint32 callbackGasLimit,
    string[3] memory dogTokenUris
  )
    VRFConsumerBaseV2(vrfCoordinator)
    ERC721("Random IPFS NFT", "RIN")
    Ownable()
  {
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
    i_subscriptionId = subscriptionId;
    i_gasLane = gasLane;
    i_callbackGasLimit = callbackGasLimit;
    s_dogTokenUris = dogTokenUris;
    i_mintFee = mintFee;
  }

  function requestNft() public payable returns (uint256 requestId) {
    if (msg.value < i_mintFee) {
      revert RandomIpfsNft__NeedMoreETHSent();
    }
    requestId = i_vrfCoordinator.requestRandomWords(
      i_gasLane,
      i_subscriptionId,
      REQUEST_CONFIRMATIONS,
      i_callbackGasLimit,
      NUM_WORDS
    );
    s_requestIdtoSender[requestId] = msg.sender;
    emit NftRequested(requestId, msg.sender);
  }

  function withdraw() public onlyOwner {
    uint256 amount = address(this).balance;
    (bool success, ) = payable(msg.sender).call{value: amount}("");
    if (!success) {
      revert RandomIpfsNft__TransferFailed();
    }
  }

  function fulfillRandomWords(
    uint256 requestId,
    uint256[] memory randomWords
  ) internal override {
    //mint不能在这里，否则就变成chainlink节点作为msg.sender 因为这个函数是chainlink节点来调用的。 所以需要一个map
    //_safeMint(msg.sender, s_tokenCounter);
    address dogOwner = s_requestIdtoSender[requestId];
    uint newTokenId = s_tokenCounter;
    s_tokenCounter += 1;

    //0~99
    uint moddedRng = randomWords[0] % MAX_CHANCE_VALUE;
    //0<=x<10  10=<x<30  30<=x<100 分别属于三种不同的nft
    Breed breed = getBreedFromModdedRng(moddedRng);
    _safeMint(dogOwner, newTokenId);
    _setTokenURI(newTokenId, s_dogTokenUris[uint256(breed)]);
    emit NftMinted(breed, dogOwner);
  }

  function getBreedFromModdedRng(
    uint256 moddedRng
  ) public pure returns (Breed) {
    uint256 cumulativeSum = 0;
    uint256[3] memory chanceArray = getChanceArray();
    for (uint256 i = 0; i < chanceArray.length; i++) {
      // Pug = 0 - 9  (10%)
      // Shiba-inu = 10 - 29  (30%)
      // St. Bernard = 30 = 99 (60%)
      if (moddedRng >= cumulativeSum && moddedRng < chanceArray[i]) {
        return Breed(i);
      }
      cumulativeSum = chanceArray[i];
    }
    revert RandomIpfsNft__RangeOutOfBounds();
  }

  function getChanceArray() public pure returns (uint[3] memory) {
    return [10, 30, MAX_CHANCE_VALUE];
  }

  function getMintFee() public view returns (uint256) {
    return i_mintFee;
  }

  function getDogTokenUris(uint256 index) public view returns (string memory) {
    return s_dogTokenUris[index];
  }

  //   function getInitialized() public view returns (bool) {
  //     return s_initialized;
  //   }

  function getTokenCounter() public view returns (uint256) {
    return s_tokenCounter;
  }
}
