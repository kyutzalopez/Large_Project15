import Header from '../components/Header';
import Divider from '../components/Divider';
import MovieReviewCard from '../components/CreateReview/MovieReviewCard';

function CreateReview () {
    return (
        <div id="reviewpage">
            <Header title="New Review"/>
            <Divider />
            <div className="content">
                <div id="movieCard">
                    <p>Movie Poster Displayed Here</p>
                </div>
                <MovieReviewCard />
            </div>
        </div>
    );
}

export default CreateReview;
