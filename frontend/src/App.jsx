import { Route, Routes } from "react-router";
import Home from "./pages/Home/Home";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import Roadmap from "./pages/RoadmapApp/RoadmapApp";
import Main from "./layout/Main";
import RoadmapDetails from "./pages/RoadmapApp/components/RoadmapDetails";

const App = () => {
  return (
    <Routes>
      <Route element={<Main />}>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/roadmap/:id" element={<RoadmapDetails />} />
      </Route>
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/signIn" element={<SignIn />} />
    </Routes>
  );
};

export default App;
