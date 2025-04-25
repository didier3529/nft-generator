#!/bin/bash

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PROGRAM_PATH="./src"
PROGRAM_NAME=$(basename $(pwd))
OUT_DIR="./dist/program"
SOLANA_NETWORK="devnet"

# Ensure we exit on any errors
set -e

# Create output directory if it doesn't exist
mkdir -p $OUT_DIR

# Print header
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}         SOLANA PROGRAM DEPLOYMENT TOOL          ${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# Check for required tools and environment
check_prerequisites() {
  echo -e "${YELLOW}Checking prerequisites...${NC}"
  
  # Check for Solana CLI
  if ! command -v solana &> /dev/null; then
    echo -e "${RED}Error: Solana CLI is not installed. Please install it first.${NC}"
    echo "Follow instructions at: https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
  fi
  
  # Check for Rust/Cargo
  if ! command -v cargo &> /dev/null; then
    echo -e "${RED}Error: Rust/Cargo is not installed. Please install it first.${NC}"
    echo "Follow instructions at: https://www.rust-lang.org/tools/install"
    exit 1
  fi
  
  # Check if Solana is configured with a wallet
  if ! solana config get keypair &> /dev/null; then
    echo -e "${RED}Error: No Solana wallet configured.${NC}"
    echo "Please run: solana config set --keypair /path/to/keypair.json"
    exit 1
  fi
  
  echo -e "${GREEN}All prerequisites met!${NC}"
  echo ""
}

# Display current configuration
show_config() {
  echo -e "${YELLOW}Current Configuration:${NC}"
  echo -e "  Program Path: ${GREEN}$PROGRAM_PATH${NC}"
  echo -e "  Program Name: ${GREEN}$PROGRAM_NAME${NC}"
  echo -e "  Output Directory: ${GREEN}$OUT_DIR${NC}"
  echo -e "  Current Network: ${GREEN}$SOLANA_NETWORK${NC}"
  echo -e "  Solana CLI config: ${GREEN}$(solana config get | grep json_rpc_url | awk '{print $2}')${NC}"
  echo -e "  Current Wallet: ${GREEN}$(solana address)${NC}"
  echo -e "  Wallet Balance: ${GREEN}$(solana balance)${NC}"
  echo ""
}

# Update configuration parameters
update_config() {
  echo -e "${YELLOW}Update Configuration${NC}"
  echo -e "Leave blank to keep current value"
  
  read -p "Program Path [$PROGRAM_PATH]: " input
  PROGRAM_PATH=${input:-$PROGRAM_PATH}
  
  read -p "Program Name [$PROGRAM_NAME]: " input
  PROGRAM_NAME=${input:-$PROGRAM_NAME}
  
  read -p "Output Directory [$OUT_DIR]: " input
  OUT_DIR=${input:-$OUT_DIR}
  
  echo -e "Available Networks:"
  echo -e "  1) Localnet"
  echo -e "  2) Devnet"
  echo -e "  3) Testnet"
  echo -e "  4) Mainnet-Beta"
  read -p "Select Network [2]: " network_choice
  
  case $network_choice in
    1) SOLANA_NETWORK="localnet"
       solana config set --url localhost;;
    2) SOLANA_NETWORK="devnet"
       solana config set --url https://api.devnet.solana.com;;
    3) SOLANA_NETWORK="testnet"
       solana config set --url https://api.testnet.solana.com;;
    4) SOLANA_NETWORK="mainnet-beta"
       solana config set --url https://api.mainnet-beta.solana.com;;
    *) if [[ -z $network_choice ]]; then
         # Keep current network, but ensure URL is correctly set for it
         case $SOLANA_NETWORK in
           "devnet") solana config set --url https://api.devnet.solana.com;;
           "testnet") solana config set --url https://api.testnet.solana.com;;
           "mainnet-beta") solana config set --url https://api.mainnet-beta.solana.com;;
           "localnet") solana config set --url localhost;;
         esac
       fi;;
  esac
  
  echo -e "${GREEN}Configuration updated!${NC}"
  show_config
}

# Build Solana program
build_program() {
  echo -e "${YELLOW}Building Solana program...${NC}"
  
  # Check if program path exists
  if [ ! -d "$PROGRAM_PATH" ]; then
    echo -e "${RED}Error: Program path '$PROGRAM_PATH' does not exist.${NC}"
    return 1
  fi
  
  # Build the program
  echo -e "Running cargo build-bpf..."
  (cd $PROGRAM_PATH && cargo build-bpf --bpf-out-dir $OUT_DIR)
  
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}Program built successfully!${NC}"
    echo -e "Program file: ${GREEN}$OUT_DIR/$PROGRAM_NAME.so${NC}"
  else
    echo -e "${RED}Program build failed.${NC}"
    return 1
  fi
}

# Generate new program keypair if it doesn't exist
generate_program_keypair() {
  KEYPAIR_PATH="$OUT_DIR/$PROGRAM_NAME-keypair.json"
  
  if [ -f "$KEYPAIR_PATH" ]; then
    echo -e "Program keypair already exists at: ${GREEN}$KEYPAIR_PATH${NC}"
    read -p "Generate a new keypair? (y/N): " generate_new
    
    if [[ $generate_new =~ ^[Yy]$ ]]; then
      rm "$KEYPAIR_PATH"
      solana-keygen new -o "$KEYPAIR_PATH" --no-bip39-passphrase
      echo -e "${GREEN}New program keypair generated at: $KEYPAIR_PATH${NC}"
    fi
  else
    echo -e "${YELLOW}Generating program keypair...${NC}"
    solana-keygen new -o "$KEYPAIR_PATH" --no-bip39-passphrase
    echo -e "${GREEN}Program keypair generated at: $KEYPAIR_PATH${NC}"
  fi
  
  # Display the program ID
  PROGRAM_ID=$(solana-keygen pubkey "$KEYPAIR_PATH")
  echo -e "Program ID: ${GREEN}$PROGRAM_ID${NC}"
}

# Deploy the program
deploy_program() {
  # Make sure we have a built program
  PROGRAM_SO="$OUT_DIR/$PROGRAM_NAME.so"
  KEYPAIR_PATH="$OUT_DIR/$PROGRAM_NAME-keypair.json"
  
  if [ ! -f "$PROGRAM_SO" ]; then
    echo -e "${RED}Error: Program binary not found at $PROGRAM_SO${NC}"
    echo -e "Please build the program first."
    return 1
  fi
  
  if [ ! -f "$KEYPAIR_PATH" ]; then
    echo -e "${RED}Error: Program keypair not found at $KEYPAIR_PATH${NC}"
    echo -e "Please generate program keypair first."
    return 1
  }
  
  # Check if this is mainnet and require additional confirmation
  if [[ "$SOLANA_NETWORK" == "mainnet-beta" ]]; then
    echo -e "${RED}!!! WARNING: You are deploying to MAINNET !!!${NC}"
    echo -e "${RED}This will use real SOL and deploy a live program.${NC}"
    echo -e "${YELLOW}Program ID: $(solana-keygen pubkey "$KEYPAIR_PATH")${NC}"
    echo -e "${YELLOW}Estimated cost: ~3.1 SOL${NC}"
    
    read -p "Type 'MAINNET-DEPLOY' to confirm: " mainnet_confirm
    if [[ "$mainnet_confirm" != "MAINNET-DEPLOY" ]]; then
      echo -e "${RED}Deployment canceled.${NC}"
      return 1
    fi
    
    # Double check wallet balance for mainnet
    WALLET_BALANCE=$(solana balance | cut -d ' ' -f 1)
    REQUIRED_BALANCE=3.5
    
    if (( $(echo "$WALLET_BALANCE < $REQUIRED_BALANCE" | bc -l) )); then
      echo -e "${RED}Error: Insufficient funds for deployment.${NC}"
      echo -e "Current balance: $WALLET_BALANCE SOL"
      echo -e "Recommended minimum: $REQUIRED_BALANCE SOL"
      return 1
    fi
  fi
  
  # Deploy the program
  echo -e "${YELLOW}Deploying program to $SOLANA_NETWORK...${NC}"
  echo -e "Program ID: $(solana-keygen pubkey "$KEYPAIR_PATH")"
  
  solana program deploy \
    --program-id "$KEYPAIR_PATH" \
    --keypair "$(solana config get keypair | awk '{print $2}')" \
    "$PROGRAM_SO"
  
  if [ $? -eq 0 ]; then
    PROGRAM_ID=$(solana-keygen pubkey "$KEYPAIR_PATH")
    echo -e "${GREEN}Program deployed successfully!${NC}"
    echo -e "Program ID: ${GREEN}$PROGRAM_ID${NC}"
    echo -e "Network: ${GREEN}$SOLANA_NETWORK${NC}"
    
    # Save deployment info
    DEPLOY_INFO="$OUT_DIR/deployment-info.txt"
    echo "Program Name: $PROGRAM_NAME" > "$DEPLOY_INFO"
    echo "Program ID: $PROGRAM_ID" >> "$DEPLOY_INFO"
    echo "Network: $SOLANA_NETWORK" >> "$DEPLOY_INFO"
    echo "Deployment Date: $(date)" >> "$DEPLOY_INFO"
    echo "Deployer: $(solana address)" >> "$DEPLOY_INFO"
    
    echo -e "Deployment info saved to: ${GREEN}$DEPLOY_INFO${NC}"
  else
    echo -e "${RED}Program deployment failed.${NC}"
    return 1
  fi
}

# Verify a deployed program matches the local version
verify_program() {
  PROGRAM_SO="$OUT_DIR/$PROGRAM_NAME.so"
  
  if [ ! -f "$PROGRAM_SO" ]; then
    echo -e "${RED}Error: Program binary not found at $PROGRAM_SO${NC}"
    echo -e "Please build the program first."
    return 1
  }
  
  # Get program ID
  read -p "Enter Program ID to verify: " PROGRAM_ID
  
  if [ -z "$PROGRAM_ID" ]; then
    echo -e "${RED}Error: Program ID is required.${NC}"
    return 1
  }
  
  echo -e "${YELLOW}Verifying program on $SOLANA_NETWORK...${NC}"
  
  # Fetch program data and compare
  solana program dump "$PROGRAM_ID" "$OUT_DIR/downloaded-program.so"
  
  if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to download program data.${NC}"
    return 1
  }
  
  # Compare the programs
  if cmp -s "$PROGRAM_SO" "$OUT_DIR/downloaded-program.so"; then
    echo -e "${GREEN}Verification successful! Deployed program matches local binary.${NC}"
  else
    echo -e "${RED}Verification failed! Deployed program does not match local binary.${NC}"
    echo -e "This could be due to:"
    echo -e "  1. The program was upgraded after deployment"
    echo -e "  2. The local binary was rebuilt with changes"
    echo -e "  3. The wrong Program ID was provided"
  fi
  
  # Clean up
  rm "$OUT_DIR/downloaded-program.so"
}

# Show the main menu
show_menu() {
  echo -e "${BLUE}=================================================${NC}"
  echo -e "${BLUE}                MAIN MENU                        ${NC}"
  echo -e "${BLUE}=================================================${NC}"
  echo ""
  echo -e "1) ${YELLOW}Show Configuration${NC}"
  echo -e "2) ${YELLOW}Update Configuration${NC}"
  echo -e "3) ${YELLOW}Build Program${NC}"
  echo -e "4) ${YELLOW}Generate Program Keypair${NC}"
  echo -e "5) ${YELLOW}Deploy Program${NC}"
  echo -e "6) ${YELLOW}Verify Deployed Program${NC}"
  echo -e "7) ${YELLOW}View Deployment Instructions${NC}"
  echo -e "0) ${RED}Exit${NC}"
  echo ""
  read -p "Select an option: " option
  
  case $option in
    1) show_config;;
    2) update_config;;
    3) build_program;;
    4) generate_program_keypair;;
    5) deploy_program;;
    6) verify_program;;
    7) echo -e "${YELLOW}For detailed deployment instructions, see DEPLOYMENT.md${NC}"
       if [ -f "../DEPLOYMENT.md" ]; then
         echo -e "Opening DEPLOYMENT.md..."
         cat "../DEPLOYMENT.md" | more
       else
         echo -e "${RED}DEPLOYMENT.md not found.${NC}"
       fi;;
    0) echo -e "${GREEN}Goodbye!${NC}"; exit 0;;
    *) echo -e "${RED}Invalid option. Please try again.${NC}";;
  esac
  
  # Return to menu after action completes
  echo ""
  read -p "Press Enter to continue..."
  clear
  show_menu
}

# Main execution
check_prerequisites
show_config
show_menu 