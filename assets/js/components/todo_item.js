import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import classNames from "classnames";

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.state = { editing: false };

    this.destroyTodo = this.destroyTodo.bind(this);
  }

  destroyTodo(e) {
    this.props
      .mutate({
        variables: {
          id: this.props.todo.id
        }
      })
      .then(({ data }) => {
        console.log("got data", data);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  render() {
    const { id, title, completed } = this.props.todo;
    const todoClass = classNames({ completed: completed });

    // List items should get the class `editing` when editing and `completed` when marked as completed
    return (
      <li className={todoClass}>
        <div className="view">
          <input className="toggle" type="checkbox" />
          <label>{title}</label>
          <button className="destroy" onClick={this.destroyTodo} />
        </div>
        <input className="edit" defaultValue="Rule the web" />
      </li>
    );
  }
}

const destroyTodo = gql`
  mutation DestroyTodo($id: String!) {
    destroyTodo(id: $id) {
      id
    }
  }
`;

export default graphql(destroyTodo)(TodoItem);
