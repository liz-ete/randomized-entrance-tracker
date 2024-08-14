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
      <Route path="/">
        <div className="app">
          <div>
            <h1>
              Entrance Tracker for{' '}
              <a href="https://alttpr.com" target="_blank" rel="noreferrer">
                ALTTPR
              </a>
            </h1>

            <p>
              This tracker uses a pop up window. Please make sure your browser
              is not blocking it from opening.
            </p>
            <h3>How to use</h3>
            <ul>
              <li>Right Click: Removes a location from the map.</li>
              <li>Left Click: Opens the menu with the available markers.</li>
              <li>
                Clicking on the Portal icon (bottom right icon) switches maps
                between Light and Dark Worlds.
              </li>
            </ul>
          </div>
          <button onClick={handleClick}>Open Tracker</button>
        </div>
      </Route>

      <Route path="/tracker">
        <ImageProvider>
          <Tracker></Tracker>
        </ImageProvider>
      </Route>
    </div>
  );
}

export default App;
