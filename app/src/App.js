import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';
import idl from './idl.json';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';
import { Buffer } from 'buffer';
import kp from './keypair.json';
import Meme from './Meme.jsx';
import { nanoid } from 'nanoid';



window.Buffer = Buffer;



// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// All your other Twitter and GIF constants you had.


// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const TEST_GIFS = [
	'https://www.todaysparent.com/wp-content/uploads/2017/06/when-your-kid-becomes-a-meme.jpg',
	'https://pbs.twimg.com/media/FNoeQctXMAQk1Fe.jpg',
	'https://covid-19archive.org/files/original/7128704f8e6be96a6309c4d68db53f0f9c5d625a.jpg',
	'https://www.freecodecamp.org/news/content/images/2021/03/comments-meme.jpeg'
];

const App = () => {
    /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */

  const [walletAddress, setWalletAddress] = React.useState(null);
  const [gifCheck, setGifCheck] = React.useState(true);
  const [inputValue, setInputValue] = React.useState('');
  const [gifList, setGifList] = React.useState([]);
  const [tipValue, setTipValue] = React.useState();
  
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
         /*
         * The solana object gives us a function that will allow us to connect
         * directly with the user's wallet!
         */
        const response = await solana.connect({ onlyIfTrusted: true });
        console.log(
          'Connected with Public Key:',
          response.publicKey.toString()
        );
          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        
        
        
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  React.useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

   const getGifList = async() => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    
    console.log("Got the account", account)
   //const getList = await account.gifList;
  //const sortList = await  getList.sort((a,b) => (a.myLikes > b.myLikes) ? [a, b] : [b, a]);
    const getList = await       setGifList(account.gifList);
    
  } catch (error) {
    console.log("Error in getGifList: ", error)
    setGifList();
  }
}

React.useEffect(() => {
  if (walletAddress) {
    console.log('Fetching GIF list...');
    getGifList()
  }
}, [walletAddress]);
  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   
setGifCheck(gifList.check);
*/
  const connectWallet = async () => { const { solana } = window;

  if (solana) {
    const response = await solana.connect();
    console.log('Connected with Public Key:', response.publicKey.toString());
    setWalletAddress(response.publicKey.toString());
  }
                                    };
  const onTipClick = (id) => {
    return setGifList(oldGif => oldGif.map(item => { 
      return item.id === id ? 
                {...item, showTip: !item.showTip} :
                item
        }));
    
  }

   const onTipChange = (event) => {
  const { value } = event.target;
  setTipValue(value);
};
  
  const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};

  const toSendSol = async(id) => {
   if (tipValue > 0) {
     try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
        
       const sol = await tipValue*1000000000;
       const solString = await sol.toString();

       await program.rpc.sendSol(solString, id, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        from: provider.wallet.publicKey,
        to: gifList[id].userAddress,
        systemProgram: SystemProgram.programId,
      },
    });
       
       await getGifList();
       setTipValue();
    
  } catch (error) {
    console.log("Error sending like:", error)
  } 
   } else {
     console.log("Empty input")
  }
  }

  const onCheckChange = async(id, tick, numIndex) => {
const memeClick = await setGifList(oldGif => oldGif.map(item => { return item.id === id ? 
                {...item, check: !item.check} :
                item
        }));

    if (tick === false) {
     try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    await program.rpc.upvoteGif(true, numIndex, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
       
       await getGifList();
    
  } catch (error) {
    console.log("Error sending like:", error)
  }
    } else {
       try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);


    await program.rpc.upvoteGif(false, numIndex, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
       
       await getGifList();
    
  } catch (error) {
    console.log("Error sending like:", error)
  }
    }
                 
};

  const deleteGif = async(num) => {
    
    try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    await program.rpc.removeGif(num, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
       
       await getGifList();
    
  } catch (error) {
    console.log("Error deleting gif:", error)
  }
    
  }

   /*

     
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   
setGifCheck(gifList.check);
*/

  
  const getProvider = () => {
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new Provider(
    connection, window.solana, opts.preflightCommitment,
  );
	return provider;
}
  
  const createGifAccount = async () => {
  try {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping")
    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount]
    });
    console.log("Created a new BaseAccount w/ address:", baseAccount.publicKey.toString())
    await getGifList();

  } catch(error) {
    console.log("Error creating BaseAccount account:", error)
  }
}
  
  
  const sendGif = async () => {
  if (inputValue.length === 0) {
    console.log("No gif link given!")
    return
  }

  try {
    
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
       const memeId = await nanoid();
    await program.rpc.addGif(inputValue, false, false, "0", memeId, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });
    console.log("GIF successfully sent to program", inputValue)
    setInputValue('');
    console.log('Gif link:', inputValue);

    await getGifList();
  } catch (error) {
    console.log("Error sending GIF:", error)
  }
};
  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

 
  
  const renderConnectedContainer = () => {
// If we hit this, it means the program account hasn't been initialized.
  if (gifList === undefined) {
    return (
      <div className="connected-container">
        <button className="cta-button submit-gif-button" onClick={createGifAccount}>
          Do One-Time Initialization For GIF Program Account
        </button>
      </div>
    )
  } 
	// Otherwise, we're good! Account exists. User can submit GIFs.
	else {
    return(
      <div className="connected-container">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendGif();
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Enter meme link!"
            value={inputValue}
            onChange={onInputChange}
          />
          <button type="submit" className="cta-button submit-gif-button">
            Submit
          </button>
        </form>
        <div className="gif-grid">
					{/* We use index as the key instead, also, the src is now item.gifLink */}
          {gifList.map((item, index) => (
            <Meme 
              key={item.id}
              checkChange={() => onCheckChange(item.id, item.check, index)}
              isCheck={item.check}
              memeUserAddress={item.userAddress.toString()}
              memeImage={item.gifLink}
              likes={item.myLikes.toString()}
              timestamp={item.timestamp.toString()}
              tipClick={() => onTipClick(item.id)}
              tipState={item.showTip}
              tipNum={tipValue}
              tipChange={onTipChange}
              sendTip={() => toSendSol(index)}
              viewerAddress={walletAddress}
              gifDelete={() => deleteGif(index)}
              />
          ))}
        </div>
      </div>
    )
  }
}
  
  return (
    <div className="App">
      {/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
       <div className="header-container">
           {walletAddress && (<p className="header">The <span>Meme</span> Club</p>)} {!walletAddress && (<p className="header">The Meme Club</p>)}
          <p className="sub-text">
            Enjoy your favourite meme collection in the metaverse ✨
          </p>
           {/* Render your connect to wallet button right here */}
          {!walletAddress && renderNotConnectedContainer()}
           {/* We just need to add the inverse here! */}
        {walletAddress && renderConnectedContainer()}
        </div>
    
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
