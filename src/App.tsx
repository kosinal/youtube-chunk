import "./App.css";
import Player from "./features/youtube/Player";
import background from "./img/bg.jpg";

const App = () => {
  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
      }}
    >
      <header className="App-header">
        <Player />
      </header>
    </div>
  );
};

export default App;
