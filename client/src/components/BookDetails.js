import React, { Component } from 'react';
import { gql, defaultDataIdFromObject } from 'apollo-boost'; // to create graphQL queries
import { graphql } from 'react-apollo'; //to bind query results to react component


//Creating GraphQL query
export const getBookDetailsQuery = gql`
query($id:ID){
    book(id:$id){
        name
        genre
        author
        {
          name
          age
          books{
            name
          }
        }
      
    }
}
`

class BookDetails extends Component {

    displayBookDetails = () => {
        console.log("Props:", this.props);
        const { book } = this.props.data;
        if (book) {
            return (
                <div id="book-details">
                    <h2>Title: {book.name}</h2>
                    <div>Author:{book.author.name}</div>
                    <div>Auhor Age:{book.author.age}</div>
                    <p>Books form Author {book.author.name}</p>
                    <ul>
                        {book.author.books.map(book => 
                             <li key={book.id}>{book.name}</li>
                        )}
                    </ul>
                </div>

            );

        } else {
            return <p>Click on book to see details</p>;
        }

    }

    render() {
        //console.log(this.props);
        return (
            <div id="book-details">
                {this.displayBookDetails()}
            </div>
        );
    }
}

//export default graphql(getBookDetailsQuery)(BookDetails); // Binding query results with component
//Passing prop parameter to the query
export default graphql(getBookDetailsQuery, {
    options: (props) => {
        return {
            variables: {
                id: props.bookid
            }
        }
    }
})(BookDetails);
