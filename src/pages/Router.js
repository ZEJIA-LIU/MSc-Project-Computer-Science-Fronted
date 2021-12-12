import React from 'react';
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom';
import loadable from '@loadable/component';
import 'styles/global.scss';
import { Result, Button } from 'antd';
import loadingImg from 'images/load.png';
import { Provider } from "mobx-react";
import HomeStore from "../store/home";
import SingleEditor from '../store/singleEditor'
// import Home from 'pages/home/Home';
// import Login from 'pages/user/Login';

// const Loading = () => {
//   return (<div className="loadable-loading-wrap">
//   	<Spin tip="加载中..." size="large" />
//   </div>);
// }

const stores = {
	homeStore: new HomeStore(),
	singleEditorStore: new SingleEditor()
}

function Loading(props) {
	return (
		<div className="loading-wrap">
			<div>
				<img className="loading-img" src={loadingImg} />
				<p>{props.pageName} loading...</p>
			</div>
		</div>
	);
}

const Home = loadable(() => import('pages/home/Home'), {
	fallback: <Loading pageName="homepage" />
});

const Login = loadable(() => import('pages/user/Login'), {
	fallback: <Loading pageName="login" />
});

class Router extends React.Component {
	render() {
		return (
			<Provider {...stores}>
				<BrowserRouter>
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/room" exact component={Home} />
						<Route path="/user" exact component={Home} />
						<Route path="/user/account" exact component={Home} />
						<Route path="/login" exact component={Login} />
						<Route render={() => (
							<Result
								status="404"
								title="404"
								subTitle="对不起, 您访问的页面不存在!"
								extra={<Button type="primary"><NavLink to="/">back to homepage</NavLink></Button>}
							/>
						)} />
					</Switch>
				</BrowserRouter>
			</Provider>
		);
	}
}

export default Router;