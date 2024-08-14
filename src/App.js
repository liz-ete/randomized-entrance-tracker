import './App.css';
import useNavigation from './hooks/useNavigation';
import Route from './Route';
import Tracker from './components/Tracker/Tracker';
import { ImageProvider } from './contexts/ImageContext';

function App() {
  const { navigate } = useNavigation();
  const handleClick = () => {
    navigate('/tracker');
  };
  return (
    <div>
      <div className="App">
        <Route path="/">
          <div>
            <p>NOTE: This tracker uses a pop up window.</p>
            <p>
              Please make sure your browser is not blocking it from opening.
            </p>
          </div>
          <button onClick={handleClick}>Open Tracker</button>

        </Route>
        <Route path="/tracker">
          <ImageProvider>
            <Tracker></Tracker>
          </ImageProvider>
        </Route>
      </div>
    </div>
  );
}

export default App;
