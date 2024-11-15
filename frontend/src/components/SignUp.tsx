import React, { useState } from 'react';

function Login({ closePopup, handleLoginClick }: { closePopup: () => void; handleLoginClick: () => void }) {
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
                setMessage('Passwords do not match.');
            }
            else {
                var user = { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/cards';
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
                <span id="inner-title">New Here?</span><br />
                <div id="input-field">
                    <input type="text" id="loginName" placeholder="Email"
                        onChange={handleSetLoginName} /><br />
                    <input type="password" id="loginPassword" placeholder="Username"
                        onChange={handleSetPassword} /><br />
                    <input type="password" id="loginPassword" placeholder="Password"/><br />
                    <input type="password" id="loginPassword" placeholder="Confirm Password"/><br />
                    <span id="loginResult">{message}</span>
                </div>
                
                <input type="submit" id="homeButtons" className="buttons" value="Sign Up"
                    onClick={doLogin} />
                <span id="subText">
                    Have an Account? 
                    <a id="subLogin" onClick={() => {closePopup(); handleLoginClick(); }}> Log in</a> {/* "Log in" triggers Login pop-up */}
                </span>
            </div>
        </div>
    );
};
export default Login;
