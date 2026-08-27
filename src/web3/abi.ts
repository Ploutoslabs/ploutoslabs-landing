const abi = [
  "function airdrop() external payable",
  "function buyPresale() external payable",
  "function claimAllocation(uint index) external",
  "function setPresaleRate(uint256 _rate) external",
  "function startStopPresale(bool _status) external",
  "function giveAllocation(address user, uint256 amount) external",
  "function presaleActive() external view returns (bool)",
  "function allocationLen(address user) external view returns (uint256)",
  "function allocationInfo(address user,uint256 index) external view returns (uint256 totalAmount,uint256 claimedAmount,uint256 nextClaimTime)",
  "event AirdropClaimed(address indexed user,uint256 amount,address indexed upline)",
  "event PresalePurchased(address indexed user, uint256 amount)",
  "event AllocationClaimed(address indexed user, uint256 amount)",
  "event PresaleRateChanged(uint256 newRate)",
  "event PresaleStatusChanged(bool isActive)",
  "event AllocationIncreased(address indexed user, uint256 amount)",
];

export default abi;
