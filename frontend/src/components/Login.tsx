import React, { useState } from 'react';

function Login({ closePopup, handleSignUpClick }: { closePopup: () => void; handleSignUpClick: () => void }) {  
    const [message, setMessage] = React.useState('');
    const [loginName, setLoginName] = React.useState('');
    const [loginPassword, setPassword] = React.useState('');

    async function doLogin(event: any): Promise<void> {
        event.preventDefault();

        var obj = { login: loginName, password: loginPassword };
        var js = JSON.stringify(obj);

        try {
            const response = await fetch('https://www.cop4331gerber.online/api/login',
                { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });

            var res = JSON.parse(await response.text());

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user = {id: res.id , email: res.email, username: res.username}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/movies';
            }
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    function handleSetLoginName(e: any): void {
        setLoginName(e.target.value);
    }

    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }

    return (
        <div id="popUpOverlay">
            <div id="popUpDiv">
                <button id="closeButton" onClick={closePopup}>X</button> {/* Close button */}
                <span id="inner-title">Login</span><br />
                <div id="input-field">
                    <input type="text" id="loginName" placeholder="Username"
                        onChange={handleSetLoginName} /><br />
                    <input type="password" id="loginPassword" placeholder="Password"
                        onChange={handleSetPassword} /><br />
                    <span id="loginResult">{message}</span>
                </div>
                
                <input type="submit" id="homeButtons" className="buttons" value="Log In"
                    onClick={doLogin} />
                <span id="subText">
                    New User? 
                <a id="subLogin" onClick={() => {closePopup(); handleSignUpClick(); }}> Sign Up</a>
            </span>
                
            </div>
        </div>
    );
};
export default Login;
