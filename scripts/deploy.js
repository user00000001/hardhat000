const { ethers, run, network } = require("hardhat");

// for etherscan connection.

// const { ProxyAgent, setGlobalDispatcher } = require("undici")
// const proxyAgent = new ProxyAgent("http://127.0.0.1:10809")
// setGlobalDispatcher(proxyAgent)

async function main() {
    const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorageFactory.deploy();
    await simpleStorage.waitForDeployment();
    console.log(`${JSON.stringify(simpleStorage)}\n${network.config}`);
    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        await verify(simpleStorage.target, []);
        // await verify("0x2d78438A084C9651d9228efBE75B5e1189d4c7e4", [])
    }
    const currentValue = await simpleStorage.retrieve();
    console.log(`Current Value is: ${currentValue.toString()}`);
    await simpleStorage.store("1000");
    const currentValue1 = await simpleStorage.retrieve();
    console.log(`Current Value is: ${currentValue1.toString()}`);
}

async function verify(contractAddress, args) {
    console.log(`${contractAddress} ${JSON.stringify(args)}`);
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch(e) {
        if(e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.error(e)
        }
    }
}

main().then(
    ()=>process.exit(0)
).catch((error)=>{
    console.error(error)
    process.exit(1)
})