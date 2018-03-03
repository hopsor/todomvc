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
    } else if (e.key === "Escape") {
      this.setState({ editing: false });
    }
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

const destroyTodo = gql`
  mutation DestroyTodo($id: String!) {
    destroyTodo(id: $id) {
      id
    }
  }
`;

export default graphql(destroyTodo)(TodoItem);
