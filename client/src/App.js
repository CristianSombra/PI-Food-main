import './App.css';
import { Route, Switch } from "react-router-dom";
import Home from "./views/home/home";
import Landing from './views/landing/landing';


function App() {
  return (
    <div className="App">
      <h1>Henry Food</h1>
      <Route exact path = "/">
          <Landing />
      </Route>

      <Route path = "/home">
          <Home />
      </Route>

    </div>
  );
}

export default App;
