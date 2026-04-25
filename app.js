// Replace with your deployed contract address from Remix
const contractAddress = "0x1Fc4107Cba281D01E939978eB6c28561B0bF0adE"; // <-- SET THIS AFTER DEPLOYMENT

// The ABI for the DegreeVerification contract
const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "bytes32",
				"name": "degreeId",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "courseName",
				"type": "string"
			}
		],
		"name": "DegreeIssued",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_studentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_courseName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_university",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_issueDate",
				"type": "string"
			}
		],
		"name": "issueDegree",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalDegreesIssued",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "universityAdmin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "_degreeId",
				"type": "bytes32"
			}
		],
		"name": "verifyDegree",
		"outputs": [
			{
				"internalType": "string",
				"name": "studentName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "courseName",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "university",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "issueDate",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isValid",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider;
let signer;
let contract;

// UI Elements
const connectBtn = document.getElementById("connectBtn");
const statusMessage = document.getElementById("statusMessage");
const tabs = document.querySelectorAll(".tab-btn");
const sections = document.querySelectorAll("section");

// Verification Elements
const verifyBtn = document.getElementById("verifyBtn");
const verifyIdInput = document.getElementById("verifyId");
const verifyResult = document.getElementById("verifyResult");
const verifyError = document.getElementById("verifyError");

// Issue Elements
const issueForm = document.getElementById("issueForm");
const issueBtn = document.getElementById("issueBtn");
const issueSuccess = document.getElementById("issueSuccess");
const issuedHash = document.getElementById("issuedHash");
const copyBtn = document.getElementById("copyBtn");

// Tab Switching Logic
tabs.forEach(tab => {
	tab.addEventListener("click", () => {
		tabs.forEach(t => t.classList.remove("active"));
		tab.classList.add("active");
		const target = tab.getAttribute("data-target");

		sections.forEach(sec => {
			sec.classList.add("hidden");
			sec.classList.remove("active");
		});
		document.getElementById(target).classList.remove("hidden");
		document.getElementById(target).classList.add("active");
	});
});

// Connect Wallet
async function connectWallet() {
	if (typeof window.ethereum !== "undefined") {
		try {
			await window.ethereum.request({ method: "eth_requestAccounts" });
			provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner();
			const address = await signer.getAddress();

			connectBtn.innerText = address.substring(0, 6) + "..." + address.substring(38);
			connectBtn.style.background = "var(--success)";

			// Connect to contract
			if (contractAddress === "0xYourContractAddressHere") {
				statusMessage.innerHTML = "⚠️ Wallet connected, but Contract Address is missing. Update app.js!";
				statusMessage.style.color = "var(--error)";
			} else {
				contract = new ethers.Contract(contractAddress, contractABI, signer);
				statusMessage.innerText = "Connected! Ready to interact with the blockchain.";
				statusMessage.style.color = "var(--success)";
			}
		} catch (error) {
			console.error("Connection failed", error);
			statusMessage.innerText = "Wallet connection failed.";
		}
	} else {
		statusMessage.innerText = "Please install MetaMask.";
	}
}

connectBtn.addEventListener("click", connectWallet);

// Verify Degree (Read-only call)
verifyBtn.addEventListener("click", async () => {
	const degreeId = verifyIdInput.value.trim();
	if (!degreeId) {
		alert("Please enter a valid Degree ID (bytes32 format).");
		return;
	}

	if (!contract) {
		alert("Please connect wallet and set the contract address.");
		return;
	}

	toggleLoader(verifyBtn, true);
	verifyResult.classList.add('hidden');
	verifyError.classList.add('hidden');

	try {
		const result = await contract.verifyDegree(degreeId);

		// Populate resulting fields
		document.getElementById("resStudent").innerText = result.studentName;
		document.getElementById("resCourse").innerText = result.courseName;
		document.getElementById("resUniversity").innerText = result.university;
		document.getElementById("resDate").innerText = result.issueDate;

		verifyResult.classList.remove('hidden');
	} catch (error) {
		console.error("Verification error", error);
		verifyError.classList.remove('hidden');
	}

	toggleLoader(verifyBtn, false);
});

// Issue Degree (Write transaction)
issueForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	if (!contract) {
		alert("Please connect wallet and set the contract address in app.js.");
		return;
	}

	const studentName = document.getElementById("studentName").value;
	const courseName = document.getElementById("courseName").value;
	const university = document.getElementById("university").value;
	const issueDate = document.getElementById("issueDate").value;

	toggleLoader(issueBtn, true);
	issueSuccess.classList.add("hidden");

	try {
		// Send transaction
		const tx = await contract.issueDegree(studentName, courseName, university, issueDate);
		statusMessage.innerText = "Transaction pending... Please wait.";

		// Wait for confirmation
		const receipt = await tx.wait();

		// Extract the degreeId from the emitted event
		// Event signature: DegreeIssued(bytes32 indexed degreeId, string studentName, string courseName)
		let newDegreeId = "";

		// Loop through logs to find the exact event. ethers parses them for us in receipt.events
		if (receipt.events && receipt.events.length > 0) {
			const event = receipt.events.find(e => e.event === "DegreeIssued");
			if (event && event.args) {
				newDegreeId = event.args.degreeId;
			}
		}

		if (!newDegreeId) {
			// fallback if event parsing issues occur, just print tx hash
			newDegreeId = receipt.transactionHash;
		}

		issuedHash.innerText = newDegreeId;
		issueSuccess.classList.remove("hidden");
		statusMessage.innerText = "Transaction Successful!";
		issueForm.reset();

	} catch (error) {
		console.error("Issuance Error", error);

		// Handle custom revert from our 'onlyAdmin' modifier
		if (error.message.includes("Only the university admin") || (error.data && error.data.message && error.data.message.includes("Only the university admin"))) {
			alert("Error: Only the wallet that deployed the contract can issue degrees.");
		} else {
			alert("Transaction failed. Open console for details.");
			statusMessage.innerText = "Failed to issue degree.";
		}
	}

	toggleLoader(issueBtn, false);
});

// Copy to clipboard
copyBtn.addEventListener("click", () => {
	navigator.clipboard.writeText(issuedHash.innerText);
	copyBtn.innerText = "✅";
	setTimeout(() => { copyBtn.innerText = "📋"; }, 2000);
});

// Helper Loader Toggle
function toggleLoader(btn, isLoading) {
	const text = btn.querySelector('.btn-text');
	const loader = btn.querySelector('.loader');

	if (isLoading) {
		text.classList.add('hidden');
		loader.classList.remove('hidden');
	} else {
		text.classList.remove('hidden');
		loader.classList.add('hidden');
	}
}
