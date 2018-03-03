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
    this.props.subscribeToUpdatedTodos();
    this.props.subscribeToDestroyedTodos();
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

  renderItemsLeft() {
    const { todos } = this.props.data;
    const reducer = (accumulator, todo) => accumulator + (todo.completed === false);
    const leftCount = todos.reduce(reducer, 0);

    return (
      <span className="todo-count">
        <strong>{leftCount}</strong> item left
      </span>
    );
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
            {this.renderItemsLeft()}
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

const todoAddedSubscription = gql`
  subscription onTodoAdded {
    todoAdded {
      id
      title
      completed
    }
  }
`;

const todoUpdatedSubscription = gql`
  subscription onTodoUpdated {
    todoUpdated {
      id
      title
      completed
    }
  }
`;

const todoDestroyedSubscription = gql`
  subscription onTodoDestroyed {
    todoDestroyed {
      id
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
          document: todoAddedSubscription,
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
      },
      subscribeToUpdatedTodos: params => {
        return props.data.subscribeToMore({
          document: todoUpdatedSubscription,
          variables: {},
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const { id } = subscriptionData.data.todoUpdated;
            const indexAffected = prev.todos.findIndex(todo => todo.id == id);
            // Calling slice as the array is frozen
            const updatedTodos = prev.todos.slice(0);

            updatedTodos.splice(indexAffected, 1, subscriptionData.data.todoUpdated);

            return Object.assign({}, prev, {
              todos: updatedTodos
            });
          }
        });
      },
      subscribeToDestroyedTodos: params => {
        return props.data.subscribeToMore({
          document: todoDestroyedSubscription,
          variables: {},
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) {
              return prev;
            }

            const { id } = subscriptionData.data.todoDestroyed;
            const updatedTodos = prev.todos.filter(todo => todo.id != id);

            return Object.assign({}, prev, {
              todos: updatedTodos
            });
          }
        });
      }
    };
  }
});

export default compose(graphql(submitTodo), withData)(TodoMVC);
