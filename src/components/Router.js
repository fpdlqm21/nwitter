import { BrowserRouter, Routes, Route} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Navigation from "./Navigation";
import Profile from "routes/Profile";

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {
    return(
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <div
                        style={{
                            maxWidth:890,
                            width: "100%",
                            margin: "0 auto",
                            marginTop: 80,
                            display: "flex",
                            justifyContent: "center",
                        }}            
            >
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route exact path="/" element={<Home userObj={userObj}/>}/>
                        <Route exact path="/profile" element={<Profile refreshUser={refreshUser} userObj={userObj}/>}/>
                    </>
                    ):(
                    <Route exact path="/" element={<Auth/>}/>
                )}
            </Routes>
            </div>
        </BrowserRouter>
    );
}

export default AppRouter;