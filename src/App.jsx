import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangLayout } from "./i18n/I18n";
import Home from "./pages/Home";
import Expertise from "./pages/Expertise";
import About from "./pages/About";
import Contact from "./pages/Contact";

// One route tree for every language: English at the root (/about), other
// languages under a prefix (/hu/about). Switching language keeps the same
// components mounted, so the page redraws in place.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/:lang?" element={<LangLayout />}>
          <Route index element={<Home />} />
          <Route path="expertise" element={<Expertise />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
