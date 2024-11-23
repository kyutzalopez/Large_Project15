import RatingInput from "./RatingInput";
import DateWatchedInput from "./DateWatchedInput";

function MovieReviewCard () {
    return (
        <div className="card">
            <p id="reviewTitle">
                Review for <i>"Good Movie"</i>
            </p>
            <div id="ratingPanel">
               <RatingInput/>
               <DateWatchedInput/> 
            </div>
            <textarea placeholder="Write your review..." />
            <button id="saveReviewButton" type="button">Save</button>
        </div>
    );
}

export default MovieReviewCard