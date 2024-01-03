import { useState } from "react";
import { storageService, dbService } from "fbase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const NeweetFactory = ({userObj}) => {
    const [attachment, setAttachment] = useState("");
    const [nweet, setNweet] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";
        
        if (attachment !== ""){
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); 
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentUrl = await getDownloadURL(ref(storageService, response.ref));
        }

        await addDoc(collection(dbService, "nweets"),{
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        });
        setNweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        event.preventDefault();
        const{
            target:{value}
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const{
            target: {files}
        } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const{
                currentTarget:{result}
            } = finishedEvent
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    return(
        <form onSubmit={onSubmit}>
            <input 
                value={nweet}
                onChange={onChange}
                type="text"
                placeholder="what's on your mind?"
                maxLength={120} 
            />
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Nweet"/>
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px" alt=""/>
                    <button onClick={onClearAttachment}>Clear</button>
                </div>
            )}
        </form>
    );
}

export default NeweetFactory