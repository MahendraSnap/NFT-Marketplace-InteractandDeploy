'use client'

import Image from 'next/image'
import { useState } from 'react'
import {deployNFT, deployMarketplace, mintNFT} from '../eth/deployer'

export default function Home() {
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [nftContractAddress, setNFTContractAddress] = useState("");
  const [marketplaceContractAddress, setMarketplaceContractAddress] = useState("");
  const [nftAirdropContractAddress, setNFTAirdropContractAddress] = useState("");
  const [ticketQueueContractAddress, setTicketQueueContractAddress] = useState("");

const downloadTxtFile = (contractName:string, contractAddress:string) => {
  const formattedContent = `Contract Address ${contractName}: ${contractAddress}`;

  const element = document.createElement('a');
  const file = new Blob([formattedContent], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = `${contractName}_address.txt`;
  document.body.appendChild(element);
  element.click();
};

const deployNFTContract = async (name:string, symbol:string, contractURI:string) => {
  try {
    const deployedAddress:any = await deployNFT(name, symbol, contractURI);
    setNFTContractAddress(deployedAddress);
  } catch (error) {
    console.error('Error deploying NFT contract:', error);
  }
};

const deployMarketPLaceContract = async (listPrice:number) => {
  try {
    const deployedAddress:any = await deployMarketplace(listPrice);
    setMarketplaceContractAddress(deployedAddress);
  } catch (error) {
    console.error('Error deploying NFT contract:', error);
  }
};

  const connectToMetamask = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsMetamaskConnected(true);
      } else {
        console.error('Metamask not installed');
      }
    } catch (error) {
      console.error('Error connecting to Metamask:', error);
    }
  };

  return (
    <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
    <div className="group rounded-lg border border-transparent px-5 py-4 ">
      <h2 className={`mb-3 text-2xl font-semibold`}>
        Deploy Smart Contract
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
        Deploy your smart contract using Metamask.
      </p>
      {isMetamaskConnected ? (
        <div className="mt-4">
          <table>
            <tbody>
              <tr>
                <td>
                  <button
                    onClick={() => deployNFTContract(
                      (document.getElementById('nftName')as HTMLInputElement).value,
                      (document.getElementById('nftSymbol')as HTMLInputElement).value,
                      (document.getElementById('nftContractURI')as HTMLInputElement).value
                    )}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Deploy NFT Contracts
                  </button>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    className="px-4 py-2 bg-grey-100 text-black rounded-md"
                    id="nftName"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Symbol"
                    className="px-4 py-2 bg-grey-100 text-black rounded-md"
                    id="nftSymbol"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Contract URI"
                    className="px-4 py-2 bg-grey-100 text-black rounded-md"
                    id="nftContractURI"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button
                    onClick={() => mintNFT(
                      (document.getElementById('contractAddress')as HTMLInputElement).value,
                      (document.getElementById('CostumeURL')as HTMLInputElement).value,
                      parseFloat((document.getElementById('royaltyFee') as HTMLInputElement).value)
                    )}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Mint NFT
                  </button>
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Name"
                    className="px-4 py-2 bg-grey-100 text-black rounded-md"
                    id="contractAddress"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="Costume URL"
                    className="px-4 py-2 bg-grey-100 text-black rounded-md"
                    id="CostumeURL"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="royalty Fee"
                    className="px-4 py-2 bg-grey-100 text-black rounded-md"
                    id="royaltyFee"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <button
                    onClick={() => deployMarketPLaceContract(
                      parseFloat(document.getElementById('marketplaceListPrice').value)
                    )}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
                  >
                    Deploy Marketplace Contracts
                  </button>
                </td>
                <td colSpan="3">
                  <input
                    type="number"
                    placeholder="List Price"
                    className="px-4 py-2 bg-grey-100 text-black rounded-md"
                    id="marketplaceListPrice"
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {nftContractAddress && (
          <div className="mb-2">
          <p>NFT Contract Address: {nftContractAddress}</p>
          <button
            onClick={() => downloadTxtFile('NFT', nftContractAddress)}
            className="mt-2 px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Download Address
          </button>
          </div>
          )}

          {marketplaceContractAddress && (
          <div className="mb-2">
          <p>MarketPlaces Contract Address: {marketplaceContractAddress}</p>
          <button
            onClick={() => downloadTxtFile('Marketplace', marketplaceContractAddress)}
            className="mt-2 px-2 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-300"
          >
            Download Address
          </button>
          </div>
          )}

        </div>
      ) : (
        <button
          onClick={connectToMetamask}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Connect to Metamask
        </button>
      )}
    </div>
  </div>
  
);
}
