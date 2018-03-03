import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import gql from "graphql-tag";
import TodoItem from "./todo_item";

class TodoMVC extends Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.props.subscribeToNewTodos();
  }

  handleKeyPress(e) {
    if (e.key === "Enter" && this.newTodoInput.value !== "") {
      this.props
        .mutate({
          variables: {
            title: this.newTodoInput.value
          }
        })
        .then(({ data }) => {
          console.log("got data", data);
          this.newTodoInput.value = "";
        })
        .catch(error => {
          console.log("there was an error sending the query", error);
        });
    }
  }

  renderTodos() {
    const { loading, todos } = this.props.data;

    if (!loading && todos.length > 0) {
      return (
        <React.Fragment>
          <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox" />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              {todos.map(todo => <TodoItem todo={todo} key={todo.id} />)}
            </ul>
          </section>
          {/* This footer should hidden by default and shown when there are todos */}
          <footer className="footer">
            {/* This should be `0 items left` by default */}
            <span className="todo-count">
              <strong>0</strong> item left
            </span>
            <button className="clear-completed">Clear completed</button>
          </footer>
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <section className="todoapp">
        <header className="header">
          <h1>todos</h1>
          <input
            className="new-todo"
            placeholder="What needs to be done?"
            autoFocus
            onKeyPress={this.handleKeyPress}
            ref={input => {
              this.newTodoInput = input;
            }}
          />
        </header>
        {/* This section should be hidden by default and shown when there are todos */}
        {this.renderTodos()}
      </section>
    );
  }
}

const submitTodo = gql`
  mutation SubmitTodo($title: String!) {
    submitTodo(title: $title) {
      id
      title
      completed
    }
  }
`;

const todosQuery = gql`
  query Todos {
    todos {
      id
      title
      completed
    }
  }
`;

const todosSubscription = gql`
  subscription onTodoAdded {
    todoAdded {
      id
      title
      completed
    }
  }
`;

const withData = graphql(todosQuery, {
  name: "data",
  options: ({ params }) => ({
    variables: {}
  }),
  props: props => {
    return {
      ...props,
      subscribeToNewTodos: params => {
        return props.data.subscribeToMore({
          document: todosSubscription,
          variables: {},
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const newItem = subscriptionData.data.todoAdded;

            return Object.assign({}, prev, {
              todos: [newItem, ...prev.todos]
            });
          }
        });
      }
    };
  }
});

export default compose(graphql(submitTodo), withData)(TodoMVC);
