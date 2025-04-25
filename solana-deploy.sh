#!/bin/bash

# Solana Deployment Interface
# This script provides a comprehensive deployment interface for Solana programs

# ASCII art
cat << "EOF"
  _____       _                        _____             _             
 / ____|     | |                      |  __ \           | |            
| (___   ___ | | __ _ _ __   __ _     | |  | | ___ _ __ | | ___  _   _ 
 \___ \ / _ \| |/ _` | '_ \ / _` |    | |  | |/ _ \ '_ \| |/ _ \| | | |
 ____) | (_) | | (_| | | | | (_| |    | |__| |  __/ |_) | | (_) | |_| |
|_____/ \___/|_|\__,_|_| |_|\__,_|    |_____/ \___| .__/|_|\___/ \__, |
                                                  | |             __/ |
                                                  |_|            |___/ 
EOF

# Function to make sure scripts are executable
ensure_executable() {
  if [ -f "$1" ] && [ ! -x "$1" ]; then
    echo "Making $1 executable..."
    chmod +x "$1"
  elif [ ! -f "$1" ]; then
    echo "Error: $1 not found. Please make sure all deployment scripts are in the same directory."
    exit 1
  fi
}

# Ensure all scripts are executable
ensure_executable "./deploy-devnet.sh"
ensure_executable "./deploy-mainnet.sh"
ensure_executable "./verify-program.sh"

# Deployment checklist
show_checklist() {
  echo ""
  echo "========== Solana Program Deployment Checklist =========="
  echo ""
  echo "Before deploying, please ensure you have completed the following:"
  echo ""
  echo "[ ] 1. Your program compiles without errors"
  echo "[ ] 2. All tests pass successfully"
  echo "[ ] 3. You have reviewed the program code for security issues"
  echo "[ ] 4. You have sufficient SOL in your wallet for deployment"
  echo "[ ] 5. You have backed up your keypair"
  echo "[ ] 6. Your program binary is built with the latest changes"
  echo "[ ] 7. Your client code is ready to use the new program ID"
  echo ""
  echo "For Mainnet Deployment, additional requirements:"
  echo ""
  echo "[ ] 8. The program has been extensively tested on devnet"
  echo "[ ] 9. You have a plan for upgrading the program if needed"
  echo "[ ] 10. You have considered using a multisig for upgrade authority"
  echo ""
}

# Display menu
show_menu() {
  echo "========== Deployment Options =========="
  echo ""
  echo "1) Deploy to Devnet (Testing Environment)"
  echo "2) Deploy to Mainnet (Production - USES REAL SOL)"
  echo "3) Verify Existing Deployment"
  echo "4) Show Deployment Checklist"
  echo "5) Build Program"
  echo "6) Exit"
  echo ""
  echo "Enter your choice [1-6]: "
}

# Function to build the program
build_program() {
  echo "Building Solana program..."
  if [ -f "Cargo.toml" ]; then
    echo "Building from project root..."
    cargo build-bpf
  elif [ -d "program" ] && [ -f "program/Cargo.toml" ]; then
    echo "Building from program directory..."
    cd program && cargo build-bpf && cd ..
  else
    echo "Error: Couldn't find Cargo.toml. Make sure you're in the right directory."
    return 1
  fi
  
  # Check if build was successful
  if [ $? -eq 0 ]; then
    echo "✅ Program built successfully!"
    
    # Ensure the dist/program directory exists
    mkdir -p dist/program
    
    # Find and copy the .so file to the expected location
    SO_FILE=$(find target/deploy -name "*.so" | head -1)
    if [ -n "$SO_FILE" ]; then
      cp "$SO_FILE" dist/program/nft_generator.so
      echo "✅ Program binary copied to dist/program/nft_generator.so"
    else
      echo "❌ Error: Couldn't find .so file in target/deploy"
      return 1
    fi
  else
    echo "❌ Program build failed"
    return 1
  fi
}

# Main loop
while true; do
  show_menu
  read -r choice
  
  case $choice in
    1)
      echo "Deploying to Devnet..."
      ./deploy-devnet.sh
      ;;
    2)
      echo "Preparing for Mainnet Deployment..."
      ./deploy-mainnet.sh
      ;;
    3)
      echo "Verifying Deployment..."
      echo "Choose network:"
      echo "1) Devnet"
      echo "2) Mainnet"
      read -r network_choice
      
      case $network_choice in
        1)
          ./verify-program.sh --network devnet
          ;;
        2)
          ./verify-program.sh --network mainnet
          ;;
        *)
          echo "Invalid choice"
          ;;
      esac
      ;;
    4)
      show_checklist
      ;;
    5)
      build_program
      ;;
    6)
      echo "Exiting..."
      exit 0
      ;;
    *)
      echo "Invalid choice. Please enter a number between 1 and 6."
      ;;
  esac
  
  echo ""
  echo "Press Enter to continue..."
  read -r
  clear
done 