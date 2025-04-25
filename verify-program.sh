#!/bin/bash

# Verify Solana Program Deployment
# This script checks if a Solana program is properly deployed on devnet or mainnet

# Function to show usage
show_usage() {
  echo "Usage: $0 [--programid PROGRAM_ID] [--network devnet|mainnet]"
  echo ""
  echo "Options:"
  echo "  --programid PROGRAM_ID   The program ID to verify (optional if program-id.json exists)"
  echo "  --network NETWORK        Network to verify (devnet or mainnet-beta, default: devnet)"
  echo ""
  echo "Example:"
  echo "  $0 --programid AbCdEf123456789... --network devnet"
  echo "  $0 --network mainnet-beta"
}

# Default values
NETWORK="devnet"
PROGRAM_ID=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --programid)
      PROGRAM_ID="$2"
      shift 2
      ;;
    --network)
      if [[ "$2" == "mainnet" ]]; then
        NETWORK="mainnet-beta"
      elif [[ "$2" == "devnet" ]]; then
        NETWORK="devnet"
      else
        NETWORK="$2"
      fi
      shift 2
      ;;
    --help)
      show_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_usage
      exit 1
      ;;
  esac
done

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
  echo "Error: Solana CLI not found. Please install it first."
  exit 1
fi

# If program ID is not provided, try to read from file
if [ -z "$PROGRAM_ID" ]; then
  if [ "$NETWORK" == "mainnet-beta" ] && [ -f "program-id-mainnet.json" ]; then
    PROGRAM_ID=$(grep -o '"programId": *"[^"]*"' program-id-mainnet.json | cut -d'"' -f4)
  elif [ "$NETWORK" == "devnet" ] && [ -f "program-id.json" ]; then
    PROGRAM_ID=$(grep -o '"programId": *"[^"]*"' program-id.json | cut -d'"' -f4)
  fi
fi

# If program ID is still not available, exit
if [ -z "$PROGRAM_ID" ]; then
  echo "Error: Program ID not provided and not found in program-id files."
  show_usage
  exit 1
fi

echo "========== Solana Program Verification =========="
echo "Network: $NETWORK"
echo "Program ID: $PROGRAM_ID"

# Configure Solana CLI to use the specified network
echo "Setting Solana config to $NETWORK..."
solana config set --url "$NETWORK"

# Verify the program
echo "Verifying program deployment..."
VERIFICATION=$(solana program show --program-id "$PROGRAM_ID" 2>&1)

# Check if verification was successful
if echo "$VERIFICATION" | grep -q "Program Id: $PROGRAM_ID"; then
  echo "✅ Program verification successful!"
  
  # Display program information
  echo ""
  echo "Program Details:"
  echo "----------------"
  echo "$VERIFICATION"
  
  # Check if the program is executable
  if echo "$VERIFICATION" | grep -q "Executable: Yes"; then
    echo ""
    echo "✅ Program is executable"
  else
    echo ""
    echo "❌ Program is not executable"
  fi
  
  # Display upgrade authority if available
  UPGRADE_AUTH=$(echo "$VERIFICATION" | grep -A1 "Upgrade authority" | tail -1 | xargs)
  if [ -n "$UPGRADE_AUTH" ]; then
    echo "Upgrade Authority: $UPGRADE_AUTH"
  fi
  
  # Display program data size
  DATA_SIZE=$(echo "$VERIFICATION" | grep "Program data len" | awk '{print $4}')
  if [ -n "$DATA_SIZE" ]; then
    echo "Program Size: $DATA_SIZE bytes"
  fi
  
  # Check program balance
  BALANCE=$(solana balance "$PROGRAM_ID" 2>/dev/null)
  if [ -n "$BALANCE" ]; then
    echo "Program Balance: $BALANCE"
  fi
  
  exit 0
else
  echo "❌ Program verification failed!"
  echo ""
  echo "Error Details:"
  echo "--------------"
  echo "$VERIFICATION"
  
  # Check if the program exists
  if echo "$VERIFICATION" | grep -q "Error: Program Id does not exist"; then
    echo ""
    echo "The program ID does not exist on $NETWORK."
    echo "Make sure you've deployed the program and are using the correct network."
  fi
  
  exit 1
fi 