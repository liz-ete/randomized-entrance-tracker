import './App.css';
import useNavigation from './hooks/useNavigation';
import Route from './Route';
import Tracker from './Components/Tracker/Tracker';

function App() {
  const { navigate } = useNavigation();
  const handleClick = () => {
    navigate('/tracker');
  };
  return (
    <div>
      <div className="App">
        <Route path="/">
          <button onClick={handleClick}>Tracker</button>
        </Route>
        <Route path="/tracker">
          <Tracker></Tracker>
        </Route>
      </div>
    </div>
  );
}

export default App;
