import React, { Component } from "react";
import ReactDOM from "react-dom";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import classNames from "classnames";

class TodoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      editText: "",
      lastKeyPressed: null
    };

    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.submitChanges = this.submitChanges.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.destroyTodo = this.destroyTodo.bind(this);
    this.handleCheckBoxClick = this.handleCheckBoxClick.bind(this);
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
    this.setState({ lastKeyPressed: e.key });

    if (e.key === "Enter") {
      this.submitChanges({ title: this.state.editText });
    } else if (e.key === "Escape") {
      this.setState({
        editing: false,
        editText: this.props.todo.title
      });
    }
  }

  submitChanges(changes) {
    this.props
      .updateTodoMutation({
        variables: { ...this.props.todo, ...changes }
      })
      .then(({ data }) => {
        console.log("got data", data);
        this.setState({ editing: false });
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  handleBlur(e) {
    if (this.state.lastKeyPressed !== "Escape") this.submitChanges({ title: this.state.editText });
  }

  destroyTodo(e) {
    this.props
      .destroyTodosMutation({
        variables: {
          ids: [this.props.todo.id]
        }
      })
      .then(({ data }) => {
        console.log("got data", data);
      })
      .catch(error => {
        console.log("there was an error sending the query", error);
      });
  }

  handleCheckBoxClick(e) {
    this.submitChanges({ completed: e.target.checked });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.editing && this.state.editing) {
      var node = ReactDOM.findDOMNode(this.refs.editField);
      node.focus();
      node.setSelectionRange(node.value.length, node.value.length);
    }
  }

  render() {
    const { id, title, completed } = this.props.todo;
    const todoClass = classNames({ completed: completed, editing: this.state.editing });

    // List items should get the class `editing` when editing and `completed` when marked as completed
    return (
      <li className={todoClass}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            onClick={this.handleCheckBoxClick}
            checked={completed}
          />
          <label onDoubleClick={this.handleEdit}>{title}</label>
          <button className="destroy" onClick={this.destroyTodo} />
        </div>
        <input
          ref="editField"
          className="edit"
          value={this.state.editText}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onBlur={this.handleBlur}
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

const destroyTodos = gql`
  mutation DestroyTodos($ids: [String]) {
    destroyTodos(ids: $ids) {
      id
    }
  }
`;

export default compose(
  graphql(updateTodo, { name: "updateTodoMutation" }),
  graphql(destroyTodos, { name: "destroyTodosMutation" })
)(TodoItem);
