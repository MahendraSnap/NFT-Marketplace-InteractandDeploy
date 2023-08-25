const ethers = require('ethers');

const Marketplace = require('./artifacts/Marketplace.json'); 
const NFT = require('./artifacts/NFT.json');

export const deployNFT = async function (_name:string, _symbol:string, _contractURI:string)  {
    if (window.ethereum) {
        const provider = await new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        try {
            const factory = await new ethers.ContractFactory(NFT.abi, NFT.bytecode, signer);
            const contract = await factory.deploy(_name, _symbol, _contractURI);
            await contract.waitForDeployment();
            console.log('NFT Contract deployed at:', await contract.getAddress());
            return await contract.getAddress();
        } catch (error) {
            console.error('Error deploying NFT contract:', error);
        }
    } else {
        console.error('Metamask not found or not connected.');
    }
}

const getNFT = async function (contractAddress:string)  {
    if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        try {
            const contract = new ethers.BaseContract(contractAddress, NFT.abi, provider);
            return contract;
        } catch (error) {
            console.error('Error NFT:', error);
        }
    } else {
        console.error('Metamask not found or not connected.');
    }
}

export const mintNFT = async function (contractAddress:string, tokenURI:string, royaltyFee:number){
    if (window.ethereum) {
        const provider = await new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = await getNFT(contractAddress);
        try {
            const tx = await contract.connect(signer).mint(await signer.getAddress(), tokenURI, royaltyFee*100);
            tx.wait();
            //console.log('Mint Succefuly');
            //return await contract.getAddress();
        } catch (error) {
            console.error('Error deploying NFT contract:', error);
        }
    } else {
        console.error('Metamask not found or not connected.');
    }
}

export const deployMarketplace = async function (_listPrice:number)  {
    if (window.ethereum) {
        const provider = await new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        try {
            const factory = await new ethers.ContractFactory(Marketplace.abi, Marketplace.bytecode, signer);
            const contract = await factory.deploy(ethers.parseEther(_listPrice.toString()));
            await contract.waitForDeployment();
            console.log('Marketplace Contract deployed at:', await contract.getAddress());
            return await contract.getAddress();
        } catch (error) {
            console.error('Error deploying Marketplace contract:', error);
        }
    } else {
        console.error('Metamask not found or not connected.');
    }
}


