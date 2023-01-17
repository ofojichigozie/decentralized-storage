import React, { useReducer } from "react";
import path from "path";
import { ethers } from "ethers";
import * as IPFS from "ipfs-http-client";
// import { Alchemy, Network } from "alchemy-sdk";
import { StorageAddress } from "./constants";
import StorageABI from "./assets/abis/Storage.json";
import Navbar from "./components/Navbar";
import AddFile from "./components/AddFile";
import FileList from "./components/FileList";
import AccountModal from "./components/AccountModal";
import "./assets/styles/App.css";

// const settings = {
//   apiKey: "l814rIevWtNORfBbDchzvi55VI7LA0IJ",
//   network: Network.ETH_GOERLI,
// };

// const alchemy = new Alchemy(settings);

const ethersUtils = {
  toWei: (value) => {
    return ethers.utils.parseEther(value.toString());
  },
  fromWei: (value) => {
    // value = BigNumber.from(value.toString());
    return ethers.utils.formatEther(value.toString());
  },
};

const ACTIONS = {
  SET_SIGNER: 0,
  SET_ADDRESS: 1,
  SET_BALANCE: 2,
  SET_STORAGE: 3,
  SET_FILE_TO_UPLOAD: 4,
  SET_CONNECTED: 5,
  SET_UPLOADING: 6,
  SET_SHOW_ACCOUNT_MODAL: 7,
  SET_IPFS_CLIENT: 8,
  SET_FILES: 9,
};

const initialState = {
  ipfsClient: null,
  signer: null,
  address: null,
  balance: "",
  Storage: {},
  fileToUpload: {
    buffer: "",
    type: "",
  },
  files: [],
  connected: false,
  loading: false,
  accountModalState: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SIGNER:
      return {
        ...state,
        signer: action.payload,
      };
    case ACTIONS.SET_ADDRESS:
      return {
        ...state,
        address: action.payload,
      };
    case ACTIONS.SET_BALANCE:
      return {
        ...state,
        balance: action.payload,
      };
    case ACTIONS.SET_STORAGE:
      return {
        ...state,
        Storage: action.payload,
      };
    case ACTIONS.SET_FILE_TO_UPLOAD:
      return {
        ...state,
        fileToUpload: action.payload,
      };
    case ACTIONS.SET_CONNECTED:
      return {
        ...state,
        connected: action.payload,
      };
    case ACTIONS.SET_UPLOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case ACTIONS.SET_SHOW_ACCOUNT_MODAL:
      return {
        ...state,
        accountModalState: action.payload,
      };
    case ACTIONS.SET_IPFS_CLIENT:
      return {
        ...state,
        ipfsClient: action.payload,
      };
    case ACTIONS.SET_FILES:
      return {
        ...state,
        files: action.payload,
      };
    default:
      return state;
  }
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = async () => {
    if (!window.ethereum) {
      return window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const networkId = (await provider.getNetwork()).chainId;
    if (networkId !== 0x5) {
      window.alert("Please, switch to the Goerli testnet");
      window.location.reload();
    }

    window.provider = provider;
    await provider.send("eth_requestAccounts", []);

    // Get signer
    const signer = provider.getSigner();
    dispatch({ type: ACTIONS.SET_SIGNER, payload: signer });

    // Load the address
    const address = await signer.getAddress();
    dispatch({ type: ACTIONS.SET_ADDRESS, payload: address });

    // Load the account balance (ETH)
    let balance = await provider.getBalance(address);
    balance = ethersUtils.fromWei(balance);
    dispatch({ type: ACTIONS.SET_BALANCE, payload: balance });

    // Load the Storage smart contract
    const Storage = new ethers.Contract(StorageAddress, StorageABI, provider);
    if (!Storage) {
      window.alert("Contract not detected on the selected network");
    }
    dispatch({ type: ACTIONS.SET_STORAGE, payload: Storage });

    dispatch({ type: ACTIONS.SET_CONNECTED, payload: true });

    // Get IPFS client
    const ipfsClient = await IPFS.create({
      host: "ipfs.infura.io",
      port: "5001",
      protocol: "https",
    });
    dispatch({ type: ACTIONS.SET_IPFS_CLIENT, payload: ipfsClient });

    // Get existing files
    const files = [
      {
        name: "Farm",
        type: "PNG",
        cid:
          "https://bafybeiedp4n2p27udrvtgptbqdywt2hffpbiidwon7ti7khz3dqaviflay.ipfs.w3s.link/farm.png",
        description: "Picture of a farm",
        timestamp: new Date().toLocaleDateString(),
      },
      {
        name: "Script",
        type: "JS",
        cid:
          "https://bafybeif3njbj6l3ol3ochn7utekuadkymnemmmhpaai76agrohw27onq64.ipfs.w3s.link/script.js",
        description: "Simple Javascript code",
        timestamp: new Date().toLocaleDateString(),
      },
      {
        name: "Rice farm",
        type: "JPG",
        cid:
          "https://bafybeicwmin7lvipd6qukdxdzh37hpu3gjfkcu5d2gp33wyh7yuy6q7qbe.ipfs.w3s.link/rice-farm.jpg",
        description: "Image of a rice farm",
        timestamp: new Date().toLocaleDateString(),
      },
    ];
    dispatch({ type: ACTIONS.SET_FILES, payload: files });

    // Get all existing files
    // const nfts = await alchemy.nft.getNftsForOwner(
    //   "0xf321b57e1f9426d6d82ff1e9abffa0d0de0dfbfc"
    // );
    // const files = nfts.ownedNfts.filter(
    //   (nft) =>
    //     nft.contract.address.toLowerCase() === StorageAddress.toLowerCase()
    // );

    // Subscribe to events
    window.ethereum.on("accountsChanged", async function(accounts) {
      await initialize();
    });
    window.ethereum.on("chainChanged", async function(networkId) {
      await initialize();
      if (networkId !== 0x5) {
        window.alert("Please, switch to the Goerli testnet");
        window.location.reload();
      }
    });
  };

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onloadend = () => {
      const fileToUpload = {
        buffer: Buffer(fileReader.result),
        type: path.extname(file.name),
      };

      dispatch({
        type: ACTIONS.SET_FILE_TO_UPLOAD,
        payload: fileToUpload,
      });
    };
  };

  const uploadFile = async (name, description) => {
    dispatch({ type: ACTIONS.SET_UPLOADING, payload: true });

    const ipfsFile = await state.ipfsClient.add(state.fileToUpload.buffer);
    const fileCid = ipfsFile.path;

    const metadata = {
      name: name,
      type: state.fileToUpload.type,
      cid: fileCid,
      description: description,
    };

    const ipfsMetadata = await state.ipfsClient.add(metadata);
    const metadataCid = ipfsMetadata.path;

    try {
      await state.Storage.connect(state.signer).save(
        state.address,
        metadataCid
      );
      window.alert("Successful");
    } catch (error) {
      window.alert(error.message);
    }
  };

  const connect = async () => {
    await initialize();
  };

  const disconnect = () => {
    window.location.reload();
  };

  const handleShowAccountModal = () => {
    dispatch({ type: ACTIONS.SET_SHOW_ACCOUNT_MODAL, payload: true });
  };

  const handleHideAccountModal = () => {
    dispatch({ type: ACTIONS.SET_SHOW_ACCOUNT_MODAL, payload: false });
  };

  return (
    <div>
      <Navbar
        connect={connect}
        address={state.address}
        onShowAccountModal={handleShowAccountModal}
      />
      <div className="container-fluid mt-5 pt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex">
            {!state.connected ? (
              <div id="loader" className="main text-center mt-5">
                <h5>Please connect wallet</h5>
              </div>
            ) : (
              <div className="main mt-5">
                <AddFile uploadFile={uploadFile} captureFile={captureFile} />
                <FileList files={state.files} />
                <AccountModal
                  accountModalState={state.accountModalState}
                  address={state.address}
                  disconnect={disconnect}
                  onHideAccountModal={handleHideAccountModal}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
