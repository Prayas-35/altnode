// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title Altnode
 * @author Altnode devs
 * @dev Altnode is a contract for managing the Altnode NFTs.
 */

contract AltTokens is ERC20 {
    /* Custom Errors */
    error Altnode__OnlyOwner();

    using Strings for uint256;

    uint256 private tokenId;
    address public owner;

    // Public mapping of owner address to list of erc20 token contracts
    mapping(address => address[]) public ownerToErc20Tokens;

    address[] public erc20Tokens;

    /* Events */
    event TokensPurchased(
        address indexed buyer,
        uint256 ethAmount,
        uint256 tokenAmount
    );

    event TokensBurned(address indexed burner, uint256 tokenAmount);

    constructor() ERC20("Altnode", "AiT") {
        tokenId = 0;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (
            msg.sender != owner ||
            msg.sender != address(0xe34b40f38217f9Dc8c3534735f7f41B2cDA73A75) ||
            msg.sender != address(0x6af90FF366aE23f4Bb719a56eBc910aF4C169aCE) ||
            msg.sender != address(0xF23be0fbE9DEf26570278F91f3F150Af015a3ECf) ||
            msg.sender != address(0xF5E93e4eEDbb1235B0FB200fd77068Cb9938eF4f)
        ) {
            revert Altnode__OnlyOwner();
        }
        _;
    }

    function buyAiT() external payable {
        uint256 exchangeRate = 1000000;
        require(msg.value > 0, "Must send ETH to purchase AiT.");
        uint256 tokenAmount = msg.value * exchangeRate;
        _mint(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    function burnAiT(uint256 amt) external {
        require(balanceOf(msg.sender) >= amt, "Insufficient AiT balance.");
        _burn(msg.sender, amt);
        emit TokensBurned(msg.sender, amt);
    }

    function setContract(address erc20Token) external {
        ownerToErc20Tokens[msg.sender].push(erc20Token);
        erc20Tokens.push(erc20Token);
    }

    function getContracts(address ownerAddress)
        external
        view
        returns (address[] memory)
    {
        return ownerToErc20Tokens[ownerAddress];
    }
}
