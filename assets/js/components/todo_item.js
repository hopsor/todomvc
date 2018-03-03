import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import classNames from "classnames";

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editText: ""
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.destroyTodo = this.destroyTodo.bind(this);
  }

  handleEdit(e) {
    this.setState({
      editing: true,
      editText: this.props.todo.title
    });
  }

  handleChange(e) {
    this.setState({ editText: e.target.value });
  }

  handleKeyDown(e) {
    if (e.key === "Enter") {
      const { id, completed } = this.props.todo;

      this.props
        .updateTodoMutation({
          variables: {
            id: id,
            title: this.state.editText,
            completed: completed
          }
        })
        .then(({ data }) => {
          console.log("got data", data);
          this.setState({ editing: false });
        })
        .catch(error => {
          console.log("there was an error sending the query", error);
        });
    } else if (e.key === "Escape") {
      this.setState({ editing: false });
    }
  }

  destroyTodo(e) {
    this.props
      .destroyTodoMutation({
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
    const todoClass = classNames({ completed: completed, editing: this.state.editing });

    // List items should get the class `editing` when editing and `completed` when marked as completed
    return (
      <li className={todoClass}>
        <div className="view">
          <input className="toggle" type="checkbox" />
          <label onDoubleClick={this.handleEdit}>{title}</label>
          <button className="destroy" onClick={this.destroyTodo} />
        </div>
        <input
          className="edit"
          value={this.state.editText}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
      </li>
    );
  }
}

const updateTodo = gql`
  mutation UpdateTodo($id: String!, $title: String!, $completed: Boolean!) {
    updateTodo(id: $id, title: $title, completed: $completed) {
      id
      title
      completed
    }
  }
`;

const destroyTodo = gql`
  mutation DestroyTodo($id: String!) {
    destroyTodo(id: $id) {
      id
    }
  }
`;

export default compose(
  graphql(updateTodo, { name: "updateTodoMutation" }),
  graphql(destroyTodo, { name: "destroyTodoMutation" })
)(TodoItem);
