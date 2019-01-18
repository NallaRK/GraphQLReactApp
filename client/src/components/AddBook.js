import React, { Component } from 'react';
import { gql, defaultDataIdFromObject } from 'apollo-boost'; // to create graphQL queries
import { graphql, compose } from 'react-apollo'; //to bind query results to react component

import {getBooksQuery} from './BookList';

//Creating GraphQL query to get authors list
const getAuthorsQuery = gql`
{
    authors{
        name
        id
    }
}
`

//passing parameters to mutation and accessing them and executing addBook Mutation
const addBookMutation = gql`
mutation($name:String!,$genre:String!,$authorid:ID!){   
    addBook(name:$name,genre:$genre,authorid:$authorid){
        name
        id
    }
}
`

class AddBook extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            genre: "",
            authorid: ""

        }
    }
    displayAuthors() {
        //const data = this.props.data;  //this works if single query binded with component
        const data = this.props.getAuthorsQuery;

        if (data.loading) {
            return (<option disabled>Loading...</option>);
        } else {
            return data.authors.map(author => (<option key={author.id} value={author.id}>{author.name}</option>));
        }
    }

    onChangeHandler = e => {
        this.setState({ [e.target.name]: e.target.value });
        // console.log("event",e.target.value);
    }

    formSubmit = e => {
        e.preventDefault();
        console.log(this.state);

        //calling GraphQL mutation to submit data to mLab
        this.props.addBookMutation({
            variables:{
                name:this.state.name,
                genre:this.state.genre,
                authorid:this.state.authorid
            },
            refetchQueries:[{query:getBooksQuery}]
        });
    }


    render() {
        console.log(this.props);
        return (
            <form id="add-book" onSubmit={this.formSubmit}>
                <div className="field">
                    <label> Book Name:</label>
                    <input name="name" type="text" onChange={this.onChangeHandler} />
                </div>
                <div className="field">
                    <label> Genre:</label>
                    <input name="genre" type="text" onChange={this.onChangeHandler} />
                </div>
                <div className="field">
                    <label> Author:</label>
                    <select name="authorid" onChange={this.onChangeHandler}>
                        <option>Select an Author</option>
                        {this.displayAuthors()}
                    </select>
                </div>

                <button>Add Book</button>
            </form>

        );
    }
}

//export default graphql(getAuthorsQuery)(AddBook); // Binding query results with component

//Binding multiple graphql query with component
export default compose(
    graphql(getAuthorsQuery, { name: "getAuthorsQuery" }),
    graphql(addBookMutation, { name: "addBookMutation" }),
)(AddBook);