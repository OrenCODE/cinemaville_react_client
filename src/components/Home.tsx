import React, {Component} from 'react';
import axios from 'axios';
import Movies from './Movies';
import MoviesNavbar from './MoviesNavbar';
import MovieModal from './MovieModal';
import EditMovieModal from './EditMovieModal';

export interface MovieObject {
    id: number
    title: string
    genre: string
}

export interface IHomeState {
    movies: MovieObject[]
    showAdd: boolean
    showEdit: boolean
    preEditFields: MovieObject[]
}

class Home extends Component <any, IHomeState> {

    constructor(props: any) {
        super(props);

        this.state = {
            movies: [],
            showAdd: false,
            showEdit: false,
            preEditFields: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:4000/movies/')
            .then(res => this.setState({
                movies: res.data
            }))
    }

    showModal = () => {
        this.setState({showAdd: true})
    };

    closeModal = () => {
        this.setState({showAdd: false})
    };

    showEditModal = () => {
        this.setState({showEdit: true})
    };

    closeEditModal = () => {
        this.setState({showEdit: false})
    };

    showAllMovies = () => {
        this.setState({
            movies: []
        });

        axios.get('http://localhost:4000/movies/')
            .then(res => this.setState({
                movies: res.data
            }))
    };

    addMovie = (event: any) => {
        event.preventDefault();
        const {movies} = this.state;
        const title = event.target.elements.title.value;
        const genre = event.target.elements.genre.value;

        axios.post(`http://localhost:4000/movies/`, {
            title,
            genre
        })
            .then((res) => {
                const id = res.data.id;
                const newMovie = {
                    id,
                    title,
                    genre,
                };
                this.setState({movies: movies.concat(newMovie)})
            })
    };

    searchMovie = (title: MovieObject) => {
        console.log(title);
        this.setState({
            movies: []
        });

        this.setState({
            movies: [title]
        })
    };

    deleteMovie = (id: number) => {
        const {movies} = this.state;

        const moviesAfterDelete = movies.filter(movie => {
            return movie.id !== id;
        });

        axios.delete(`http://localhost:4000/movies/${id}`)
            .then(res => this.setState({
                movies: moviesAfterDelete
            }))
    };

    editMovie = (movie: MovieObject) => {
        this.setState({
            preEditFields: [movie]
        });
        this.showEditModal()
    };

    saveEditedMovie = (event: any) => {
        event.preventDefault();

        const {movies} = this.state;
        const id = this.state.preEditFields[0].id;
        const title = event.target.elements.title.value;
        const genre = event.target.elements.genre.value;

        axios.put(`http://localhost:4000/movies/${id}`, {
            title,
            genre
        })
            .then((res) => {
                axios.get('http://localhost:4000/movies/')
                    .then(res => this.setState({
                        movies: res.data
                    }))
            })
    };

    // onEdit = (event: any) =>{
    //     const editedTitle = event.target.elements.title.value;
    //     const editedGenre = event.targen.elements.genre.value;
    //
    //     this.setState({
    //         preEditFields: [editedTitle]
    //     });
    //
    //     console.log(editedTitle, editedGenre)
    //
    // };

    render() {

        const {movies, showAdd, showEdit, preEditFields} = this.state;
        return (
            <div className="App">
                <MoviesNavbar showAllMovies={this.showAllMovies} showModal={this.showModal}
                              searchMovie={this.searchMovie}/>
                <Movies movies={movies} deleteMovie={this.deleteMovie} editMovie={this.editMovie}/>
                <MovieModal modalStatus={showAdd} closeModal={this.closeModal} addMovie={this.addMovie}/>
                <EditMovieModal modalStatus={showEdit} closeModal={this.closeEditModal}
                                saveEditedMovie={this.saveEditedMovie} preEditFields={preEditFields}/>
            </div>
        );
    }
}

export default Home;
