import React, { useState } from 'react';

function SignUp({ closePopup, handleLoginClick }: { closePopup: () => void; handleLoginClick: () => void }) {
    const [message, setMessage] = React.useState('');
    const [userEmail, setEmail] = React.useState('');
    const [loginName, setLoginName] = React.useState('');
    const [loginPassword, setPassword] = React.useState('');
    const [loginRePassword, setRePassword] = React.useState('');

    async function doSignUp(event: any): Promise<void> {
        event.preventDefault();

        var obj = { email: userEmail, login: loginName, password: loginPassword, repassword: loginRePassword };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch('https://www.cop4331gerber.online/api/signup',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (obj.password === obj.repassword) {
                setMessage('Passwords do not match.');
            }
            else {
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/login';
            }
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    function handleSetuserEmail(e: any): void {
        setEmail(e.target.value);
    }

    function handleSetLoginName(e: any): void {
        setLoginName(e.target.value);
    }

    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }

    function handleSetRePassword(e: any): void {
        setRePassword(e.target.value);
    }



    return (
        <div id="popUpOverlay">
            <div id="popUpDiv">
                <button id="closeButton" onClick={closePopup}>X</button> {/* Close button */}
                <span id="inner-title">New Here?</span><br />
                <div id="input-field">
                    <input type="text" id="userEmail" placeholder="Email"
                        onChange={handleSetuserEmail} /><br />
                    <input type="test" id="loginName" placeholder="Username"
                        onChange={handleSetLoginName} /><br />
                    <input type="password" id="loginPassword" placeholder="Password"
                        onChange={handleSetPassword} /><br />
                    <input type="repassword" id="loginRePassword" placeholder="Confirm Password"
                        onChange={handleSetRePassword} /><br />
                    <span id="loginResult">{message}</span>
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
