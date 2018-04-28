import AllPins from '../../client/Components/Containers/AllPins/AllPins.jsx';
import CreateAccount from '../../client/Components/Containers/CreateAccount/CreateAccount.jsx';
import IndexPage from '../../client/Components/Containers/IndexPage/IndexPage.jsx';
import LoginPage from '../../client/Components/Containers/LoginPage/LoginPage.jsx';
import UserPins from '../../client/Components/Containers/UserPins/UserPins.jsx';
import NotFound from '../../client/Components/Presentations/NotFound/NotFound.jsx';

const routes = [
    {
        path: '/',
        exact: true,
        component: IndexPage
    },
    {
        path: '/login',
        exact: true,
        component: LoginPage
    },
    {
        path: '/create-account',
        exact: true,
        component: CreateAccount
    },
    {
        path: '/pins/:user',
        exact: true,
        render: true,
        component: UserPins
    },
    {
        path: '/pins-all',
        exact: true,
        render: true,
        component: AllPins
    },
    {
        component: NotFound
    }
];

export default routes;