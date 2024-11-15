function LoggedInName() {

    var _ud = localStorage.getItem('user_data');
    if (_ud == null) _ud = "";
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var username = ud.username;
    var email = ud.email;

    function doLogout(event: any): void {
        event.preventDefault();

        localStorage.removeItem("user_data")
        window.location.href = '/';

    };

    return (
        <div id="loggedInDiv">
            <span id="collectionTitle"> {username}'s Collection</span><br />
            <button type="button" id="logoutButton" className="buttons"
                onClick={doLogout}> Log Out </button>
        </div>
    );

};
export default LoggedInName;

