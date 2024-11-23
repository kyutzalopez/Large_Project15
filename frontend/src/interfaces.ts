// Movie Interface to help display movies + data transfer easier

interface Movie {
    title: string,
    director: string,
    rating?: number,
    review?: string,
    hasWatched: boolean,
}