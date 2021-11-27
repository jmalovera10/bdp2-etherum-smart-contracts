pragma solidity >=0.4.24;

contract StarNotary {
    string public starName;
    address public starOwner;

    event StarClaimed(address owner);

    constructor() public {
        starName = "Awesome Udacity Star";
    }

    function claimStar() public {
        starOwner = msg.sender;
        emit StarClaimed(msg.sender);
    }
}
