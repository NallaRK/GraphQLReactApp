import React, { Component } from 'react';
import { gql, defaultDataIdFromObject } from 'apollo-boost'; // to create graphQL queries
import { graphql } from 'react-apollo'; //to bind query results to react component


//Creating GraphQL query
const getBooksQuery = gql`
{
    books{
        name
        id
    }
}

`

class BookList extends Component {

    displayBooks() {
        var data = this.props.data;
        if(data.loading){
            return (<div>Loading books...</div>);
        }else{
            return data.books.map(book=>{
                return (<li key={book.id}>{book.name}</li>);
            })
        }
    }
    render() {
        console.log(this.props);
        return (
            <div>
                <ul id="book-list">
                    {this.displayBooks()}
                </ul>

            </div>
        );
    }
}

export default graphql(getBooksQuery)(BookList); // Binding query results with component
