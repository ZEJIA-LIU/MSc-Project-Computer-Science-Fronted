import 'styles/home/home.scss';

import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import CodeEditor from 'components/CodeEditor';
import { Menu, Icon, Skeleton } from 'antd';
import HeaderUserInfo from './HeaderUserInfo';
import Room from '../room/Room';
import UserInfo from '../user/UserInfo';

const pathMap = {
	'/': 'edit',
	'/room': 'room'
};

class HomePage extends React.Component {
	constructor(props) {
		super(props);
		let { pathname } = this.props.history.location;
		this.state = {
			// isCheckToken: true,
			currentPage: pathMap[pathname]
		};
	}

	menuClick = e => {
		this.setState({
			currentPage: e.key
		})
	};

	changeCurrentPage = page => {
		this.setState({
			currentPage: page
		});
	};

	// closeTokenCheck = () => {
	// 	this.setState({
	// 		isCheckToken: false
	// 	});
	// };

	render() {
		let { isCheckToken, currentPage } = this.state;

		return (
			<div>
				<header className="home-header">
					<div className="home-header-inner">
						<h1 className="home-title">
							<Icon type="code" />
							<span className="title-name">Learn Code Together</span>
						</h1>
						<div>
							<Menu onClick={this.menuClick} selectedKeys={[currentPage]} mode="horizontal">
								<Menu.Item key="edit">
									<NavLink to="/"><Icon type="edit" />Single Editor</NavLink>
								</Menu.Item>
								{/*<Menu.Item key="api">
				          <NavLink to="/api"><Icon type="api" />API</NavLink>
				       	</Menu.Item>*/}
								<Menu.Item key="room">
									<NavLink to="/room"><Icon type="team" />Multiplayer editor</NavLink>
								</Menu.Item>
							</Menu>
						</div>
						<HeaderUserInfo changeCurrentPage={this.changeCurrentPage} />
					</div>
				</header>
				<div className="container-wrap">
					<div className="container">
						{
							// isCheckToken ? (
							// 	<Skeleton active />
							// ) : (
							// 	<div>
							// 		<Route path="/" exact component={ CodeEditor } />
							// 		<Route path="/room" exact component={ Room } />
							// 		<Route path="/user" exact component={ UserInfo } />
							// 	</div>
							// )
						}
						<div>
							<Route path="/" exact component={CodeEditor} />
							<Route path="/room" exact component={Room} />
							<Route path="/user" exact component={UserInfo} />
							<Route path="/user/account" exact component={UserInfo} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}


export default HomePage;