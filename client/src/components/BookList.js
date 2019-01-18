import React, { Component } from 'react';
import { gql, defaultDataIdFromObject } from 'apollo-boost'; // to create graphQL queries
import { graphql } from 'react-apollo'; //to bind query results to react component
import BookDetails from './BookDetails';


//Creating GraphQL query
export const getBooksQuery = gql`
{
    books{
        name
        id
    }
}

`

class BookList extends Component {

    constructor(props){
        super(props);
        this.state={
            selected:null
        }
    }
    displayBooks() {
        var data = this.props.data;
        if(data.loading){
            return (<div>Loading books...</div>);
        }else{
            return data.books.map(book=>{
                return (<li key={book.id} onClick={this.clickedBook(book.id)}>{book.name}</li>);
            })
        }
    }

    clickedBook=bookid=>e=>{
        this.setState({selected:bookid});
    }

    render() {
        //console.log(this.props);
        return (
            <div>
                <ul id="book-list">
                    {this.displayBooks()}
                </ul>
                <BookDetails bookid={this.state.selected}/>
            </div>
        );
    }
}

export default graphql(getBooksQuery)(BookList); // Binding query results with component
