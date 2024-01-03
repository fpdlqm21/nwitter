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
        <>
            <NweetFactory userObj={userObj}/>
                <div>
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
        </>
    );
};

export default Home;