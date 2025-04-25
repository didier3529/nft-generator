# Solana Program Deployment Guide

This guide provides instructions for deploying Solana programs to both Devnet (testing) and Mainnet (production) environments.

## Prerequisites

1. [Solana CLI tools](https://docs.solana.com/cli/install-solana-cli-tools) installed
2. [Rust](https://www.rust-lang.org/tools/install) and Cargo installed
3. Solana BPF toolchain installed (`solana-install install`)
4. A funded Solana wallet for deployment costs

## File Structure

- `solana-deploy.sh` - Main deployment interface
- `deploy-devnet.sh` - Script for Devnet deployment
- `deploy-mainnet.sh` - Script for Mainnet deployment
- `verify-program.sh` - Utility to verify program deployments
- `program-id.json` - (Generated) Contains the Devnet program ID
- `program-id-mainnet.json` - (Generated) Contains the Mainnet program ID

## Getting Started

1. Make all scripts executable:
   ```bash
   chmod +x *.sh
   ```

2. Run the main deployment interface:
   ```bash
   ./solana-deploy.sh
   ```

## Deployment Workflow

### Step 1: Build the Program

1. Select option 5 from the main menu: "Build Program"
2. This will compile your Solana program and prepare it for deployment
3. Verify that the program was built successfully

### Step 2: Devnet Deployment

1. Select option 1 from the main menu: "Deploy to Devnet"
2. The script will:
   - Check for Solana CLI and required files
   - Create a devnet keypair if one doesn't exist
   - Check and top up your balance if needed
   - Deploy the program to Devnet
   - Save the program ID to `program-id.json`
   - Update frontend configuration
   - Verify the deployment

### Step 3: Testing on Devnet

1. After deployment, thoroughly test your program on Devnet
2. Verify your client application works correctly with the deployed program
3. Fix any issues and redeploy if necessary

### Step 4: Mainnet Deployment

When you're ready for production:

1. Select option 2 from the main menu: "Deploy to Mainnet"
2. The script will:
   - Ask for multiple confirmations (this uses REAL SOL)
   - Prompt for your mainnet keypair (DO NOT use devnet keypair)
   - Display your balance and estimated deployment cost
   - Verify program binary checksum
   - Deploy to Mainnet
   - Save the program ID to `program-id-mainnet.json`
   - Update frontend configuration for Mainnet
   - Verify the deployment

### Step 5: Verify Existing Deployment

You can verify a previously deployed program at any time:

1. Select option 3 from the main menu: "Verify Existing Deployment"
2. Choose the network (Devnet or Mainnet)
3. The script will check if the program is properly deployed and executable

## Program IDs

After deployment, program IDs are saved to:
- Devnet: `program-id.json`
- Mainnet: `program-id-mainnet.json`

These IDs are also automatically added to your frontend configuration at:
- `client/src/config/solana.js`

## Deployment Checklist

The deployment interface includes a comprehensive checklist (option 4) to ensure you've covered all important aspects before deployment.

## Troubleshooting

### Common Issues

1. **Insufficient funds**: Make sure your wallet has enough SOL for deployment
   ```bash
   solana balance --keypair ~/.config/solana/devnet-keypair.json --url devnet
   solana airdrop 2 --keypair ~/.config/solana/devnet-keypair.json --url devnet
   ```

2. **Binary not found**: Ensure the program is built correctly
   ```bash
   cargo build-bpf
   mkdir -p dist/program
   cp target/deploy/your_program_name.so dist/program/nft_generator.so
   ```

3. **Deployment failed**: Check Solana network status and logs
   ```bash
   solana config get
   solana cluster-version --url devnet
   ```

4. **Permission denied**: Make sure scripts are executable
   ```bash
   chmod +x *.sh
   ```

### Network Considerations

- **Devnet**: Free to use, can get SOL from faucet, resets periodically
- **Testnet**: More stable than Devnet, also free to use
- **Mainnet-Beta**: Production network, uses real SOL, permanent deployments

## Security Considerations

1. **Keypair Security**:
   - Never share or commit your keypair files
   - Store mainnet keypairs securely (hardware wallet recommended)
   - Consider using a multisig for upgrade authority

2. **Upgrade Authority**:
   - The upgrade authority can update the program
   - For production, consider transferring to a multisig wallet
   - Or use a program to make the contract immutable

3. **Program Verification**:
   - Always verify your program after deployment
   - Check that program data matches your binary
   - Verify program IDs match in your client applications

## Advanced Usage

### Custom Program Path

If your program is not in the default location:

```bash
PROGRAM_PATH=/custom/path/program.so ./deploy-devnet.sh
```

### Using Custom RPC Endpoints

For better reliability:

```bash
SOLANA_RPC_URL=https://your-custom-rpc.com ./deploy-devnet.sh
```

### Deploying with Buffer Account

For larger programs:

```bash
DEPLOY_WITH_BUFFER=true ./deploy-devnet.sh
```

## References

- [Solana CLI Documentation](https://docs.solana.com/cli)
- [Solana Program Deployment](https://docs.solana.com/cli/deploy-a-program)
- [Solana Program Upgrades](https://docs.solana.com/cli/deploy-a-program#redeploy-a-program) 