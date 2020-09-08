import React, { Component } from "react";
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { API, graphqlOperation, Analytics, Auth } from 'aws-amplify';

const listTodos = `query listTodos {
  listTodos{
    items{
      id
      name
      description
    }
  }
}`;

const addTodo = `mutation createTodo($name:String! $description: String!) {
  createTodo(input:{
    name:$name
    description:$description
  }){
    id
    name
    description
  }
}`;

class App extends Component {
  todoMutation = async () => {
    const todoDetails = {
      name: "Party tonight!",
      description: "Amplify CLI rocks!"
    };

    const newTodo = await API.graphql(graphqlOperation(addTodo, todoDetails));
    alert(JSON.stringify(newTodo));
  };

  listQuery = async () => {
    console.log("listing todos");
    const allTodos = await API.graphql(graphqlOperation(listTodos));
    alert(JSON.stringify(allTodos));
  };
  state = { username: "" };
  async componentDidMount() {
      try {
        const user = await Auth.currentAuthenticatedUser();
        this.setState({ username: user.username });
      } catch (err) {
        console.log("error getting user: ", err);
      }
    }
  recordEvent = () => {
    Analytics.record({
      name: "My test event",
      attributes: {
        username: this.state.username
      }
    });
  };
  deleteEvent = () => {
    Analytics.record({
      name: "Delete",
      attributes: {
        username: this.state.username
      }
    });
  };
  render() {
    return (
      <div className="App">
        <AmplifySignOut />
        <p> Click a button </p>
        <button onClick={this.listQuery}>GraphQL List Query</button>
        <button onClick={this.todoMutation}>GraphQL Todo Mutation</button>
        <button onClick={this.recordEvent}>Record Event</button>
        <button onClick={this.deleteEvent}>Delete Event</button>
      </div>
    );
  }
}

export default withAuthenticator(App, true);