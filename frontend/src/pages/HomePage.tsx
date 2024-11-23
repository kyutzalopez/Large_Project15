import React, { useState } from 'react';
import PageTitle from '../components/HomePage/PageTitle.tsx';
import Login from '../components/HomePage/Login.tsx';
import SignUp from '../components/HomePage/SignUp.tsx';

const LoginPage = () => {
      // State to control whether the Login component should be displayed
    const [isLoginVisible, setIsLoginVisible] = useState(false);
    const [isSignUpVisible, setIsSignUpVisible] = useState(false);

    // Function to show the Login component
    const handleLoginClick = () => {
        setIsSignUpVisible(false); // Hide the SignUp popup
        setIsLoginVisible(true);   // Show the Login popup
    };

    // Function to show the SignUp component
    const handleSignUpClick = () => {
        setIsLoginVisible(false);  // Hide the Login popup
        setIsSignUpVisible(true);  // Show the SignUp popup
    };

    // Function to close the Login/SignUp components
    const closePopup = () => {
        setIsLoginVisible(false);
        setIsSignUpVisible(false);
    };

    return (
        <div id = "homeDiv" >
            <PageTitle />
            
            <button id="homeButtons" onClick={handleSignUpClick}>Sign Up </button><br/>
            <span id="subText">
                Existing User?
                <a id="subLogin" onClick={handleLoginClick}>Log in</a>
            </span>

            {isSignUpVisible && <SignUp closePopup={() => setIsSignUpVisible(false)} handleLoginClick={handleLoginClick} />}
            {isLoginVisible && <Login closePopup={() => setIsLoginVisible(false)} handleSignUpClick={handleSignUpClick} />}
        </div>
    );
};
export default LoginPage;

