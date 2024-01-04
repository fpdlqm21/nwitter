import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { useState, useEffect } from "react";
import { dbService} from "fbase";
import {addDoc, collection, onSnapshot, orderBy, query} from "firebase/firestore";

const Home = ({userObj}) => {
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const orderQuery = query(collection(dbService, "nweets"), orderBy("createdAt", "desc"));
        onSnapshot(orderQuery, (snapshot) => {
            const newArray = snapshot.docs.map((document)=>({
                id: document.id,
                ...document.data(),
            }));
            setNweets(newArray);
        })
    },[]);

    return (
        <div className="container">
            <NweetFactory userObj={userObj}/>
                <div style={{marginTop: 30}}>
                    {
                        nweets.map((nweet) => (
                            <Nweet 
                                key={nweet.id} 
                                nweetObj={nweet}
                                isOwner={nweet.creatorId === userObj.uid}
                            />
                        ))
                    }
                </div>
        </div>
    );
};

export default Home;