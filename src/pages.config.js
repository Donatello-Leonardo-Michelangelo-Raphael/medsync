import Home from './pages/Home';
import Records from './pages/Records';
import DocumentDetail from './pages/DocumentDetail';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Records": Records,
    "DocumentDetail": DocumentDetail,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};