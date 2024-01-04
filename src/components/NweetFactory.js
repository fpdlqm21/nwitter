import { useState } from "react";
import { storageService, dbService } from "fbase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";

const NeweetFactory = ({userObj}) => {
    const [attachment, setAttachment] = useState("");
    const [nweet, setNweet] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrl = "";

        if (nweet === "")
            return;
        
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
        if (Boolean(theFile))
            reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment("");

    return(
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input 
                    className="factoryInput__input"
                    type="text"
                    onChange={onChange}
                    placeholder="what's on your mind?"
                    maxLength={120} 
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus}/>
            </label>
            <input
                id="attach-file" 
                type="file" 
                accept="image/*" 
                onChange={onFileChange}
                style={{
                    opacity: 0
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img src={attachment} style={{backgroundImage: attachment,}}/>
                    <div className="factoryForm__clear" onClick={onClearAttachment}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
            )}
        </form>
    );
}

export default NeweetFactory