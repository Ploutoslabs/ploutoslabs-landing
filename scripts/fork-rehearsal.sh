#!/usr/bin/env bash
# Rehearse the $PLTL dashboard against a LOCAL FORK of Base — no real money involved.
#
# What it does
#   1. Starts anvil forked from Base mainnet (same chain id 8453, real PLTL contract state).
#   2. Impersonates the PLTL contract owner and grants TEST_WALLET an allocation.
#   3. Funds TEST_WALLET with fork ETH for gas.
#   Then you point MetaMask at the fork and drive the real UI: connect, see the ledger, claim.
#
# Requirements: foundry (anvil + cast) — https://getfoundry.sh
#
# Usage
#   scripts/fork-rehearsal.sh <TEST_WALLET_ADDRESS> [ALLOCATION_PLTL=100]
#
# MetaMask setup (do this in a FRESH Chrome profile with only MetaMask installed —
# other wallet extensions fight over window.ethereum and break connections):
#   chrome --user-data-dir="$HOME/chrome-pltl-test"   # then install MetaMask, import/create the test wallet
#   Settings → Networks → Base → edit RPC URL to http://127.0.0.1:8545   (chain id stays 8453)
#   ⚠ Change it back to https://mainnet.base.org when you're done.
#
# Then:  npm run dev  →  http://localhost:5173/dashboard  →  Connect wallet → Claim.
# To fast-forward to the next unlock while the fork runs:
#   cast rpc evm_increaseTime 2592000 --rpc-url http://127.0.0.1:8545 && cast rpc evm_mine --rpc-url http://127.0.0.1:8545
set -euo pipefail

PLTL=0x45254F4c45545341f2a657501881B20439cBAF90
OWNER=0xE34150718Be876f330dd621000e44fb0aA6d735e     # PLTL owner() on Base
RPC=http://127.0.0.1:8545
FORK_URL="${FORK_URL:-https://mainnet.base.org}"

TEST_WALLET="${1:-}"
AMOUNT_PLTL="${2:-100}"
if [[ -z "$TEST_WALLET" ]]; then
  echo "usage: $0 <TEST_WALLET_ADDRESS> [ALLOCATION_PLTL]" >&2
  exit 1
fi
command -v anvil >/dev/null || { echo "anvil not found — install foundry: https://getfoundry.sh" >&2; exit 1; }

AMOUNT_RAW=$(cast to-wei "$AMOUNT_PLTL" gwei)   # PLTL has 9 decimals (gwei = 1e9), so "0.5" works too

echo "▶ starting anvil fork of Base ($FORK_URL) on $RPC …"
anvil --fork-url "$FORK_URL" --port 8545 --silent &
ANVIL_PID=$!
trap 'echo; echo "▶ stopping fork"; kill $ANVIL_PID 2>/dev/null || true' EXIT

for _ in $(seq 1 300); do cast chain-id --rpc-url $RPC >/dev/null 2>&1 && break; sleep 0.2; done
echo "  chain id $(cast chain-id --rpc-url $RPC), block $(cast block-number --rpc-url $RPC)"

echo "▶ funding $TEST_WALLET with 10 fork-ETH"
cast rpc anvil_setBalance "$TEST_WALLET" 0x8AC7230489E80000 --rpc-url $RPC >/dev/null

echo "▶ impersonating owner $OWNER → giveAllocation($TEST_WALLET, $AMOUNT_PLTL PLTL)"
cast rpc anvil_impersonateAccount "$OWNER" --rpc-url $RPC >/dev/null
cast rpc anvil_setBalance "$OWNER" 0x8AC7230489E80000 --rpc-url $RPC >/dev/null
cast send "$PLTL" "giveAllocation(address,uint256)" "$TEST_WALLET" "$AMOUNT_RAW" \
  --from "$OWNER" --unlocked --rpc-url $RPC >/dev/null

echo "  allocationLen  = $(cast call "$PLTL" 'allocationLen(address)(uint256)' "$TEST_WALLET" --rpc-url $RPC)"
echo "  allocationInfo = $(cast call "$PLTL" 'allocationInfo(address,uint256)(uint256,uint256,uint256)' "$TEST_WALLET" 0 --rpc-url $RPC | tr '\n' ' ')"
echo
echo "✔ Fork ready. Point MetaMask's Base network at $RPC, run 'npm run dev', open /dashboard."
echo "  (First claim is available immediately; each claim releases 1% and locks the batch for 30 days.)"
echo "  Ctrl-C stops the fork."
wait $ANVIL_PID
