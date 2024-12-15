// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ChessGame is Ownable, ReentrancyGuard {
    struct Game {
        address white;
        address black;
        uint256 stake;
        bool isActive;
        address winner;
        uint256 startTime; // Informational only, not used in critical logic
    }

    mapping(string => Game) public games;
    mapping(address => uint256) public playerEarnings;

    uint256 public ownerFeePercentage = 5; // 5% fee

    event GameCreated(string gameId, address indexed white, uint256 stake, uint256 startTime);
    event GameJoined(string gameId, address indexed black);
    event GameEnded(string gameId, address indexed winner, uint256 prize);

    constructor() {}

    /// @notice Creates a new chess game with a given gameId and stake.
    /// @param gameId The unique identifier for the game.
    function createGame(string calldata gameId) external payable {
        require(msg.value > 0, "Stake must be greater than 0");
        require(games[gameId].white == address(0), "Game already exists");

        games[gameId] = Game({
            white: msg.sender,
            black: address(0),
            stake: msg.value,
            isActive: true,
            winner: address(0),
            startTime: block.timestamp // For informational purposes only
        });

        emit GameCreated(gameId, msg.sender, msg.value, block.timestamp);
    }

    /// @notice Joins an existing game by providing the correct stake.
    /// @param gameId The unique identifier for the game to join.
    function joinGame(string calldata gameId) external payable {
        Game storage game = games[gameId];
        require(game.white != address(0), "Game does not exist");
        require(game.black == address(0), "Game already full");
        require(msg.value == game.stake, "Incorrect stake amount");

        game.black = msg.sender;
        emit GameJoined(gameId, msg.sender);
    }

    /// @notice Ends a game and declares the winner. Only the owner can call this.
    /// @param gameId The unique identifier for the game to end.
    /// @param winner The address of the winner.
    function endGame(string calldata gameId, address winner) external onlyOwner {
        Game storage game = games[gameId];
        require(game.isActive, "Game not active");
        require(winner == game.white || winner == game.black, "Invalid winner");

        game.isActive = false;
        game.winner = winner;

        uint256 totalPrize = game.stake * 2;
        uint256 ownerFee = (totalPrize * ownerFeePercentage) / 100;
        uint256 winnerPrize = totalPrize - ownerFee;

        playerEarnings[winner] += winnerPrize;

        emit GameEnded(gameId, winner, winnerPrize);
    }

    /// @notice Withdraw earnings for the caller.
    function withdrawEarnings() external nonReentrant {
        uint256 amount = playerEarnings[msg.sender];
        require(amount > 0, "No earnings to withdraw");

        playerEarnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    /// @notice Withdraw accumulated fees by the owner.
    function withdrawOwnerFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
}
