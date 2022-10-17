import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  // defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    localhost: {
      // url: "http://127.0.0.1:8545",
      url: "https://hecrpc.hecchain.com",
      // 0x5938d55f145DFB255CeD62770a2A9bF6069270F5 //0xB317a254B46CC7D3E5E3d6c402fdB0F517Bcb3AA
      accounts:["145a8eb8b810875f997193a1f0fc03ec835c430d0662d66b88987f99a98303ef","034cf3d291ff2f81095d72922f07c17eb9411dd406f4375ab3948b2137146174"]
    },
    // testnet: bscTestnet,
    // mainnet: bscMainnet,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.8.7",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.8.4",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
      {
        version: "0.5.16",
        // settings: {
        //   optimizer: {
        //     enabled: false,
        //     runs: 99999,
        //   },
        // },
      },
      {
        version: "0.4.18",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
    ],
  },
};

export default config;
