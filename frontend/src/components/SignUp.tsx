import React, { useState } from 'react';

function SignUp({ closePopup, handleLoginClick }: { closePopup: () => void; handleLoginClick: () => void }) {
    const [message, setMessage] = React.useState('');
    const [signUpEmail, setEmail] = React.useState('');
    const [signUpLogin, setLoginName] = React.useState('');
    const [signUpPassword, setPassword] = React.useState('');
    const [signUpRepassword, setRepassword] = React.useState('');

    async function doSignUp(event: any): Promise<void> {
        event.preventDefault();

        var obj = { email: signUpEmail, login: signUpLogin, password: signUpPassword, repassword: signUpRepassword};
        var js = JSON.stringify(obj);

        try {
            const response = await fetch('https://www.cop4331gerber.online/api/signup',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.id <= 0) {
                setMessage('Passwords do not match.');
            }
            else {
                var user = { email: res.email, username: res.username, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/'; //going back to homepage
            }
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    function handleSetEmail(e: any): void {
        setEmail(e.target.value);
    }

    function handleSetLoginName(e: any): void {
        setLoginName(e.target.value);
    }

    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }

    function handleSetRepassword(e: any): void {
        setRepassword(e.target.value);
    }

    return (
        <div id="popUpOverlay">
            <div id="popUpDiv">
                <button id="closeButton" onClick={closePopup}>X</button> {/* Close button */}
                <span id="inner-title">New Here?</span><br />
                <div id="input-field">
                    <input type="text" id="signUpEmail" placeholder="Email"
                        onChange={handleSetEmail} /><br />
                    <input type="text" id="signUpLogin" placeholder="Username"
                        onChange={handleSetLoginName} /><br />
                    <input type="password" id="signUpPassword" placeholder="Password"
                        onChange={handleSetPassword} /><br />
                    <input type="password" id="signUpRepassword" placeholder="Confirm Password"
                        onChange={handleSetRepassword} /><br />
                    <span id="signUpResult">{message}</span>
                </div>
                
                <input type="submit" id="homeButtons" className="buttons" value="Sign Up"
                    onClick={doSignUp} />
                <span id="subText">
                    Have an Account? 
                    <a id="subLogin" onClick={() => {closePopup(); handleLoginClick(); }}> Log in</a> {/* "Log in" triggers Login pop-up */}
                </span>
            </div>
        </div>
    );
};
export default SignUp;
