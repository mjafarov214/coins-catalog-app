import React from 'react';
import { BrowserRouter as Router, Route} from "react-router-dom";
import './App.css';
import CoinsList from './Components/CoinsList';
import CoinsHomepage from './Components/CoinsHomepage';
import Login from './Components/Login';
import AdminPanelHome from './Components/AdminPanelHome';
import CoinAdd from './Components/CoinAdd';
import CoinEdit from './Components/CoinEdit';
import CoinAbout from './Components/CoinAbout'


class App extends React.Component{

  state = {
    token: localStorage.getItem('token'),
    username: localStorage.getItem('username')
  }

  onLogin = (token, username) => {
    this.setState({ token, username });
    localStorage.setItem('token',token);
    localStorage.setItem('username',username);
  }

  render(){
    return(
      <Router>

        <Route exact path='/'>
          <CoinsHomepage/>
        </Route>

        <Route exact path='/coins/bullion'>
          <CoinsList typeCoin='bullion'/>
        </Route>

        <Route exact path='/coins/exclusive'>
          <CoinsList typeCoin='exclusive'/>
        </Route>

        <Route exact path='/coins/commemorative'>
          <CoinsList typeCoin='commemorative'/>
        </Route>

        <Route exact path='/login'>
          <Login onLogin={this.onLogin}/>
        </Route>

        <Route exact path='/admin'>
          <AdminPanelHome/>
        </Route>

        <Route exact path='/coin/add'>
          <CoinAdd/>
        </Route>

        <Route exact path='/coin/edit/:ID' component={CoinEdit}/>
        
        <Route exact path='/coin/info/:ID' component={CoinAbout}/>  
        
      </Router>
    )
  }
}


export default App;
