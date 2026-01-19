import DocumentDetail from './pages/DocumentDetail';
import Home from './pages/Home';
import Records from './pages/Records';
import __Layout from './Layout.jsx';


export const PAGES = {
    "DocumentDetail": DocumentDetail,
    "Home": Home,
    "Records": Records,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};