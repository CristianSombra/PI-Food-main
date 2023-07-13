import './App.css';
import { Route, Switch } from "react-router-dom";
import { Home, Landing, Detail, Form } from "./views";


function App() {
  return (
    <div className="App">
      <h1>Henry Food</h1>
      <Route exact path ="/" component = {Landing} />
      <Route exact path ="/detail" component = {Detail} />
      <Route exact path ="/create" component = {Form} />

      <Route path = "/home" render= {() => <Home />} />
    </div>
  );
}

export default App;
