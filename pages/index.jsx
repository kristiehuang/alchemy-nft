import { useState } from 'react'
import { NftCard } from '../components/nftCard'

const Home = () => {

  const [walletAddress, setWalletAddress] = useState("")
  const [selectedCollection, setSelectedCollection] = useState("")
  const [nfts, setNfts] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)

  async function fetchNFTs() {
    let nfts
    const requestOptions = {
      method: 'GET'
    };


    if (!fetchForCollection) {
      const requestUrl = `${process.env.NEXT_PUBLIC_ALCHEMY_URL}/getNFTs/?owner=${walletAddress}`
      if (!selectedCollection) {
        // fetch all NFTs
        nfts = await fetch(requestUrl, requestOptions).then(data => data.json())
      } else {
        // fetch only collection NFTs
        const fetchUrl = `${requestUrl}&contractAddresses%5B%5D=${selectedCollection}`
        nfts = await fetch(fetchUrl, requestOptions).then(data => data.json())
      }
      if (nfts) {
        console.log("nfts:", nfts)
        setNfts(nfts.ownedNfts)
      }
    } else {
      const requestUrl = `${process.env.NEXT_PUBLIC_ALCHEMY_URL}/getNFTsForCollection/`
      const fetchURL = `${requestUrl}?contractAddress=${selectedCollection}&withMetadata="true"`
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
      if (nfts) {
        console.log("nfts:", nfts)
        setNfts(nfts.nfts)
      }
    }
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-y-3">
      <div className="flex flex-col w-full justify-center items-center gap-y-2">
        <input 
          onChange={(e)=>{setWalletAddress(e.target.value)}}
          value={walletAddress} 
          type={"text"} 
          placeholder="Add your wallet address"></input>
        <input 
          onChange={(e)=>{setSelectedCollection(e.target.value)}}
          value={selectedCollection} 
          type={"text"} 
          placeholder="Add the collection address"></input>
        <label className="text-gray-600 ">
          <input 
            type={"checkbox"} 
            className="mr-2" 
            onChange={(e)=>{setFetchForCollection(e.target.checked)}}
          ></input>
          Fetch for collection
        </label>
        <button 
          className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"}
          onClick={fetchNFTs}
        >Let's go! </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          nfts.length && nfts.map(nft => {
            return (
              <NftCard nft={nft}></NftCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home
