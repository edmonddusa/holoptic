import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { stripLang } from "../i18n/languages";

export default function Layout() {
  const { pathname, hash } = useLocation();
  // Ignore the language prefix, so switching language keeps the scroll position.
  const page = stripLang(pathname);
  useEffect(() => {
    // Links like /expertise#cloud land on that section; others start at the top.
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [page, hash]);
  return (
    <>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
