import './App.css';
import { Route, useLocation, Switch } from "react-router-dom";
import { Home, Landing, Detail, Form } from "./views";
import NavBar from './components/navbar/navbar';


function App() {

const location = useLocation();

  return (
    <div className="App">
      {location.pathname !=="/" && <NavBar />}
      <h1>Henry Food</h1>
      <Route exact path ="/" component = {Landing} />
      <Route path = "/home" render= {() => <Home />} />
      <Route exact path ="/detail" component = {Detail} />
      <Route exact path ="/create" component = {Form} />

    </div>
  );
}

export default App;
