# Build a Web3 app on Solana with React and Rust

All the steps of the Buildspace tutorial to create a web3 dapp on Solana with React and Rust.

1. [Install Rust](https://doc.rust-lang.org/book/ch01-01-installation.html)

2. [Install Solana](https://docs.solana.com/cli/install-solana-cli-tools#use-solanas-install-tool)

3. Install Node, NPM and Mocha  

    `npm install -g mocha`

4. [Install Anchor](https://project-serum.github.io/anchor/getting-started/installation.html#install-anchor)

    Anchor makes it really easy to run Solana programs locally and deploy them to the actual Solana chain.

    `cargo install --git https://github.com/project-serum/anchor anchor-cli --locked`

    This project starts from the command:
    `anchor init myepicproject --javascript`


5. Create a keypair
`solana-keygen new`

6. Create a keypair for the web3 

To allow users to use your dApp or application on Solana, they will need to get access to their Keypair. A Keypair is a private key with a matching public key, used to sign transactions.

There are two ways to obtain a Keypair:

    Generate a new Keypair
    Obtain a Keypair using the secret key

You can obtain a new Keypair with the following: `cd app/src; node createKeyPair.js`