import { authService, dbService } from "fbase";
import {useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { collection, where, query, orderBy, getDocs } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const Profile = ({userObj, refreshUser}) => {
    const history = useNavigate();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history("/");
    };

    const onChange = (event) => {
        const {
            target:{value}
        } = event;
        setNewDisplayName(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName){
            await updateProfile(userObj, {displayName: newDisplayName});
            refreshUser();
        }
    }

    // useEffect(() => {
    //     getMyNweets();
    // }, [])

    // const getMyNweets = async () => {
    //     const q = query(
    //         collection(dbService, "nweets"), 
    //         where("creatorId", "==", userObj.uid),
    //         orderBy("createdAt", "asc")
    //         );
        
    //     const nweets = await getDocs(q);
    //     console.log(nweets.docs.map(doc => doc.data()));
    // };


    return(
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input 
                    type="text" 
                    placeholder="Display name" 
                    onChange={onChange}
                    value={newDisplayName}
                    autoFocus
                    className="formInput"
                />
                <input 
                    type="submit" 
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};

export default Profile;