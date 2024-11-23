import LoggedInName from '../components/LoggedInName';
import CardUI from '../components/Dashboard/CardUI';
import searchIcon from '../assets/icons/search.png'; // Import the image
import Divider from '../components/Divider';
import Header from '../components/Header';

const Dashboard = () => {
    return (
        <div id="dashboard">      
            {/* using placeholder for LoggedInName until Login is functional */}
            <Header title="User's Collection"/>
            
            <div id="buttonPanel">
                <p id="subheading">Your Reviews</p><br />
                <div id="searchButtonWrapper">
                    <input id="searchBar" type="text" placeholder="Search Your Reviews..."/>
                    <button id="searchButton"><img id = "searchIcon" src={searchIcon}/></button>
                </div>
                <button id="addReviewButton" type="button">Add New Review</button>
            </div>    
    
            <Divider/>

            {/* adding this Component causes the page to go blank for some reason */}
            {/* <CardUI /> */}
        </div>
    );
}
export default Dashboard;