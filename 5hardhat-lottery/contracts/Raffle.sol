//投入彩票-》随机选择一个winner
//winner to be selected every X minutes -》并且完全自动
//通过chainlink预言机获得随机数，自动执行则使用chainlik Keeper
//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
//1.导入一个接口和抽象合约
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
//5.导入自动化用途的其他合约 用于override
import "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";

error Raffle__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayers, uint256 raffleState);
error Raffle__NotEnoughETHEntered();
error Raffle__TransferFailed();
error Raffle__SendMoreToEnterRaffle();
error Raffle__RaffleNotOpen();

//2和6.继承一个抽象合约，实现其中的方法
contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    enum RaffleState {
        OPEN,
        CALCULATING
    }
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    // Lottery Variables
    uint256 private immutable i_interval;
    uint256 private s_lastTimeStamp;
    address private s_recentWinner;

    RaffleState private s_raffleState;

    /* Events */

    event RequestedRaffleWinner(uint256 indexed requestId);
    event RaffleEnter(address indexed player);
    event WinnerPicked(address indexed player);

    //	VRF协调员 0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D
    //2.把协调者参数传到抽象合约里面
    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane, // keyHash
        uint256 interval,
        uint256 entranceFee,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        //2.实例化协调者，address vrfCoordinatorV2 在这里调用方法
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() external payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__RaffleNotOpen();
        }
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    //3.重写来自VRCConsumerBaseV2抽象合约的方法,外部的协调者会让本函数调用这个方法
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_raffleState = RaffleState.OPEN; //抽奖之后设置为打开，可以继续参与
        s_players = new address payable[](0); //抽奖完成之后重置
        s_lastTimeStamp =block.timestamp; //时间更新
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }
        emit WinnerPicked(recentWinner);
    }

    //4.写你自己请求随机数之后的操作requestRandomWinner()=>改名为performUpkeep
    ////6.自动话 所需的两个函数
    function performUpkeep(
        bytes calldata /* performData */
    ) public override {
        
        (bool upkeepNeeded, ) = checkUpkeep("");
        // require(upkeepNeeded, "Upkeep not needed");
        if (!upkeepNeeded) {
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }
        //请求随机数
        //当我们得到随机数的时候 do something
        s_raffleState = RaffleState.CALCULATING;
        //协调者的方法的参数见https://docs.chain.link/vrf/v2/subscription/examples/get-a-random-number
        //4.请求随机数，协调者会自动调用上面的fulfillRandomWords（但不是同时，可能过一段时间？）
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, //0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRaffleWinner(requestId);
    }

    /**
     * @dev This is the function that the Chainlink Keeper nodes call
     * they look for `upkeepNeeded` to return True.
     * the following should be true for this to return true:
     * 1. The time interval has passed between raffle runs.
     * 2. The lottery is open.
     * 3. The contract has ETH.
     * 4. Implicity, your subscription is funded with LINK.
     */
    //6.自动所需的两个函数
    function checkUpkeep(
        bytes memory /* checkData */ /*这里external 改成public 是为了手动调用的时候,改成memroy是因为传入“” 的时候会报错如果是calldata不允许转换*/
    )
        public
        view
        override
        returns (
            bool upkeepNeeded,
            bytes memory /* performData */
        )
    {
        bool isOpen = RaffleState.OPEN == s_raffleState;
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = s_players.length > 0;
        bool hasBalance = address(this).balance > 0;
        upkeepNeeded = (timePassed && isOpen && hasBalance && hasPlayers);
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getRequestConfirmations() public pure returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getLastTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getNumberOfPlayers() public view returns (uint256) {
        return s_players.length;
    }
}
