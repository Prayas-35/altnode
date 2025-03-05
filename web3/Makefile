compile:
	npx hardhat compile

deploy:
	npx hardhat run ignition/modules/AltNode.ts --network sonicTestnet

verify:
	npx hardhat verify --network sonicTestnet 0x6a87E98E2AE1d6cbA3699a6792f4CC561Cc000aD

deploy-token:
	npx hardhat run ignition/modules/token.ts --network sonicTestnet

verify-token:
	npx hardhat verify --network sonicTestnet 0x49E8c60458f7938D63164D2c115E07D58a64De64

deploy-accessControl:
	npx hardhat run ignition/modules/AccessControl.ts --network baseSepolia

verify-accessControl:
	npx hardhat verify --network baseSepolia 0x69A840189F4F26f67eC92d3A1bCa818711fE14aa
