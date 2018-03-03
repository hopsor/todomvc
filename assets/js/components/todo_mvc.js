import React, { Component } from "react";

export default class TodoMVC extends Component {
  constructor(props){
    super(props);
  }

  render(){
      return (
        <section className="todoapp">
          <header className="header">
            <h1>todos</h1>
            <input className="new-todo" placeholder="What needs to be done?" autoFocus />
          </header>
          { /* This section should be hidden by default and shown when there are todos */ }
          <section className="main">
            <input id="toggle-all" className="toggle-all" type="checkbox" />
            <label htmlFor="toggle-all">Mark all as complete</label>
            <ul className="todo-list">
              { /*
                These are here just to show the structure of the list items
                List items should get the class `editing` when editing and `completed` when marked as completed
              */}
              <li className="completed">
                <div className="view">
                  <input className="toggle" type="checkbox" defaultChecked />
                  <label>Taste JavaScript</label>
                  <button className="destroy"></button>
                </div>
                <input className="edit" defaultValue="Create a TodoMVC template" />
              </li>
              <li>
                <div className="view">
                  <input className="toggle" type="checkbox" />
                  <label>Buy a unicorn</label>
                  <button className="destroy"></button>
                </div>
                <input className="edit" defaultValue="Rule the web" />
              </li>
            </ul>
          </section>
          { /* This footer should hidden by default and shown when there are todos */ }
          <footer className="footer">
            { /* This should be `0 items left` by default */ }
            <span className="todo-count"><strong>0</strong> item left</span>
            <button className="clear-completed">Clear completed</button>
          </footer>
        </section>
      );
  }
}
