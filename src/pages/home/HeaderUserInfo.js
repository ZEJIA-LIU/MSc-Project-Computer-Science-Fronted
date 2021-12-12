import 'styles/home/header-user-info.scss';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, message, Menu, Dropdown, Icon } from 'antd';
import axios from 'axios';
import { apiAddress } from 'config';



export default class HeaderUserInfo extends React.Component {
	state = {
		isLogin: false,
		nickname: ''
	};

	checkLogin = async () => {
		let { token } = localStorage;
		if (!token) {
			// this.props.closeTokenCheck();
			return;
		}

		let verifyRes;
		try {
			verifyRes = await axios.post(apiAddress + '/user/verifyToken', { token });
		} catch (err) {
			message.error('Error verifying token');
			return;
		}

		let { code, desc, data } = verifyRes.data;
		if (code === 0) {
			let { status, msg, userInfo } = data;
			if (status === 0) {
				let { userId, nickname, avatar } = userInfo;
				localStorage['userId'] = userId;
				localStorage['nickname'] = nickname;
				localStorage['avatar'] = avatar;
				this.setState({
					isLogin: true,
					nickname,
					avatar
				});
			} else {
				// message.warn(msg);
				this.removeToken();
			}
		} else {
			message.error(desc);
		}
		// this.props.closeTokenCheck();
	};

	componentWillMount() {
		this.checkLogin();
	}

	goUserInfo = () => {
		this.props.changeCurrentPage('info');
	};

	logout = () => {
		this.removeToken();
		location.href = '/login';
	}

	removeToken() {
		localStorage.removeItem('token');
		localStorage.removeItem('userId');
		localStorage.removeItem('avatar');
		localStorage.removeItem('nickname');
	}

	render() {
		let { isLogin, nickname, avatar } = this.state;
		return isLogin ? (
			<Dropdown overlay={(
				<Menu>
					<Menu.Item onClick={this.goUserInfo}>
						<NavLink to="/user"><Icon className="mr-5" type="user" />User information</NavLink>
					</Menu.Item>
					<Menu.Item onClick={this.logout}>
						<a><Icon className="mr-5" type="poweroff" />Logout</a>
					</Menu.Item>
				</Menu>
			)}>
				<div className="user-info">
					<Avatar shape="square" src={avatar} />
					<span className="user-name">{nickname}</span>
					<Icon type="down" />
				</div>
			</Dropdown>
		) : (
			<div className="plr-10 txt-blue">
				<NavLink to="/login">Login</NavLink>
			</div>
		)
	}
}
