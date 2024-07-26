import './App.css';
import useNavigation from './hooks/useNavigation';
import Route from './Route';
import Tracker from './Components/Tracker/Tracker';
import { ImageProvider } from './contexts/ImageContext';

function App() {
  const { navigate } = useNavigation();
  const handleClick = () => {
    navigate('/tracker');
  };
  const deleteLocalStorage = () => {
    if (window.confirm('Are you sure you want to delete your local storage?')) {
      localStorage.removeItem('lightWorldLocations');
      localStorage.removeItem('darkWorldLocations');
    }
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

          <p>
            Seems like you have an old session runnin, do you want to delete the
            old session? All your previous locations will be lost
          </p>
          <button onClick={deleteLocalStorage}>Delete</button>
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
