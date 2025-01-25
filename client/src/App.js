import { BrowserRouter, Routes, Route} from "react-router-dom";
import Homepage from "./components/Homepage";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/video/:videoId" element={<VideoPlayer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
