import 'styles/room/editor-room.scss';
import React from 'react';
import { Button, Card, Avatar, Input, Tooltip } from 'antd';
import
CodeEditorRoom from 'components/CodeEditorRoom';
import MessageBox from './MessageBox';
import { observer, inject } from "mobx-react";
@inject("homeStore")
@observer
class EditorRoom extends React.Component {
	constructor(props) {
		super(props);
		const { homeStore } = props
		let { roomInfo } = homeStore;

		this.state = Object.assign({}, {
			myUserId: localStorage['userId']
		});
		console.log(roomInfo)
		// roomId: '',
		// userList: {},
		// userListArr: [],
		// userCount: 1,
		// editorCode: '',
		// editorUser: null
		// msgList: []
		// editorStatus: {
		// 	activePanel: '1',
		// 	isRunning: false,
		// 	stdin: '',
		// 	runResult: {}
		// }
	}

	componentDidMount() {
		let { socket } = this.props;
		const { homeStore } = this.props
		const { setUsers, setEditorUser, releaseEditor, setEitorCode, setMsgList, setEditorStatus, roomInfo, code } = homeStore
		console.log(code, 'fuck')
		socket.on('user enter', ({ userList, userListArr }) => {

			setUsers(userList, userListArr)
		});

		socket.on('user exit', ({ userList, userListArr }) => {


			setUsers(userList, userListArr)
		});

		socket.on('user got editor', userInfo => {
			setEditorUser(userInfo)
		});

		socket.on('user released editor', () => {
			releaseEditor()
		});

		socket.on('code updated', data => {
			// console.log('code updated: ' + +new Date());
			let { code } = data;
			setEitorCode(code)

			console.log(code, 'update code')
		});

		let msgListEl = document.getElementsByClassName('message-list')[0];
		socket.on('got msg', msgList => {
			// console.log('got msg: ' + +new Date());
			setMsgList(msgList)
			msgListEl.scrollTo(0, msgListEl.scrollHeight - 300);
		});

		socket.on('editorStatus updated', updateStatus => {
			let { editorStatus } = roomInfo;
			console.log('触发啦')

			setEditorStatus(Object.assign(editorStatus, updateStatus))
		});

		socket.on('got run result', result => {
			let { editorStatus } = roomInfo;
			// console.log(result);
			setEditorStatus(Object.assign(editorStatus, {
				activePanel: '2',
				isRunning: false,
				runResult: result
			}))

		})
		code && setEitorCode(code)
	}

	getEditor = () => {
		this.props.socket.emit('get editor')
	};

	releaseEditor = () => {
		this.props.socket.emit('release editor');
	};

	editorCodeChange = code => {
		const { homeStore } = this.props
		const { setUsers, setEditorUser, releaseEditor, _setEitorCode, setMsgList, setEditorStatus, roomInfo } = homeStore
		const { myUserId } = this.state;
		const { editorUser } = roomInfo
		console.log(roomInfo)
		if (myUserId != editorUser.userId) return;
		// console.log('code change: ' + +new Date());
		_setEitorCode(code)
		this.props.socket.emit('update code', {
			code
		});
	};

	updateEditorStatus = updateStatus => {
		const { homeStore } = this.props
		const { setUsers, setEditorUser, releaseEditor, seteEitorCode, setMsgList, setEditorStatus, roomInfo } = homeStore
		let { editorStatus } = roomInfo
		setEditorStatus(Object.assign(editorStatus, updateStatus))
		console.log(editorStatus, 'status')
		this.props.socket.emit('update editorStatus', {
			updateStatus
		});
	};

	sendMsg = content => {
		// console.log('send msg: ' + +new Date());
		this.props.socket.emit('send msg', {
			content
		});
	}

	render() {
		let { exitRoom } = this.props;
		const { homeStore } = this.props
		const { roomInfo } = homeStore
		const { roomId, userList, userListArr, editorCode, editorUser, msgList, editorStatus } = roomInfo
		let { myUserId } = this.state;

		console.log(homeStore, 'test')

		return (
			<div className="editor-room-contaniner">
				<div>
					<div className="room-id-wrap">
						<span>romm ID: {roomId}</span>
						<a className="txt-blue float-r" onClick={exitRoom}>exit room</a>
					</div>
					<CodeEditorRoom
						layout="vertical"
						editorCode={editorCode}
						editorCodeChange={this.editorCodeChange}
						editorStatus={editorStatus}
						updateEditorStatus={this.updateEditorStatus}
						editable={!!(editorUser) && editorUser.userId == myUserId} />
				</div>
				<div className="editor-room-right">
					<Card className="room-user-list" title="Room users" size="small">
						{
							userListArr.map((item, index) => {
								return (
									<div className="user-item" key={index}>
										<Avatar shape="square" src={item.avatar} />
										<span className="user-name">{item.nickname}</span>
									</div>
								);
							})
						}
					</Card>

					<Card title="Editor Status" className="room-editor-status" size="small">
						<div className="pb-10">
							<label>current user: </label>
							{
								editorUser ? (
									<span className="user-item">
										<Avatar size="small" shape="square" src={editorUser.avatar} />
										<span className="user-name">{editorUser.nickname}</span>
									</span>
								) : (
									<span>none</span>
								)
							}
						</div>
						<div>
							<Button className="mr-10" type="primary" disabled={editorUser != null} onClick={this.getEditor}>use the editor</Button>
							<Button type="primary" disabled={editorUser === null || editorUser.userId !== myUserId} onClick={this.releaseEditor}>release the editor</Button>
						</div>
					</Card>

					<MessageBox
						sendMsg={this.sendMsg}
						msgList={msgList} />
				</div>
			</div>
		);
	}
}

export default EditorRoom;
