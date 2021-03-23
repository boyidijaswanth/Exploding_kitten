import './App.css';
import ModalComponent from './components/modalComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from './components/Dashboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  BrowserRouter
} from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Switch>
          <Route path='/' exact component={ModalComponent} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/leaderboard' component={Dashboard} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
