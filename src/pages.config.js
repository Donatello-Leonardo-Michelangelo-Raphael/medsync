import DocumentDetail from './pages/DocumentDetail';
import Home from './pages/Home';
import Records from './pages/Records';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "DocumentDetail": DocumentDetail,
    "Home": Home,
    "Records": Records,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};