import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'

function RatingInput () {
    const [rating, setRating] = useState(0);

    // Catch Rating value
    const handleRating = (rate: number) => {
        setRating(rate)

    // other logic
    }

    return (
        <div id="rating">
            <h3>Rating</h3>
            <Rating allowFraction={true}/>
        </div>
    );
}

export default RatingInput