# Decentralized Degree Verification DApp

A professional Web3 application for academic institutions to formally issue immutable degree certificates on the blockchain, and for employers or any third party to cryptographically verify their authenticity. 

## Features
- **Smart Contract Backend**: Developed in Solidity `^0.8.0` with role-based access control (only the university admin who deployed the contract can mint degrees).
- **Premium User Interface**: Built with modern HTML, CSS (Deep Blue & Gold palette with glassmorphism), and Vanilla JavaScript for a lightweight, yet dynamic feel.
- **Ethers.js Integration**: Direct frontend connection to Ethereum/local testnets via MetaMask.

## Setup & Deployment Guide

Follow these steps to deploy the contract on Remix and connect it to your frontend. This is exactly what you need to show your professor.

### Step 1: Compile & Deploy the Smart Contract
1. Open [Remix IDE](https://remix.ethereum.org/).
2. In the "File explorer", create a new file named `DegreeVerification.sol`.
3. Copy the entire contents of the `DegreeVerification.sol` provided in this folder and paste it into the new Remix file.
4. Go to the **Solidity Compiler** tab (icon looks like a 'S'). Click **Compile DegreeVerification.sol**.
5. Switch to the **Deploy & Run Transactions** tab (Ethereum logo icon).
6. Set the **Environment** dropdown to `Injected Provider - MetaMask` (Make sure MetaMask is installed and unlocked, and you are on a testnet like Sepolia or simply a Local Network).
7. Ensure your MetaMask account has some test ETH.
8. Click **Deploy**. MetaMask will pop up asking for confirmation. Click "Confirm".

### Step 2: Configure the Frontend (`app.js`)
1. Once the transaction confirms, under "Deployed Contracts" in Remix, click the **copy address** icon next to your newly deployed `DegreeVerification` contract.
2. Open the `app.js` file in your code editor.
3. On line 2, replace the dummy address with your actual deployed contract address:
   ```javascript
   const contractAddress = "0xYourActualContractAddress..."; // Paste it here
   ```
4. **Save** the `app.js` file.

### Step 3: Run the Application Locally
Because modern browsers restrict importing modules or running certain JS APIs from direct file protocol (`file:///`), it's highly recommended to use a local development server.

If you have VS Code installed:
1. Install the "Live Server" extension.
2. Right-click on `index.html` and select **"Open with Live Server"**.

Alternatively, if you have Python installed, open your terminal in this folder and run:
```bash
python -m http.server 8000
```
Then go to `http://localhost:8000` in your web browser.

### Step 4: Interact & Present!
1. **Connect Wallet:** Click "Connect Wallet" on the top right.
2. **Issue an admin degree:**
   - Go to the **"Issue Degree (Admin)"** tab.
   - *Note: You must be using the exact same MetaMask account that deployed the contract, otherwise the transaction will fail (security feature!).*
   - Fill in student details: "John Doe", "B.S. CS", "Your University", and the date.
   - Click "Mint Degree Certificate" and confirm the MetaMask transaction.
   - Copy the generated unique bytes32 Address Hash!
3. **Verify the degree:**
   - Switch to the **"Verify Degree"** tab.
   - Paste the Hash you just copied.
   - Click "Verify Document" to retrieve and prove the validity of the degree.
   
Congratulations on your blockchain assignment!
