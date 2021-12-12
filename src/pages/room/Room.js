import 'styles/room/room.scss';
import React from 'react';
import { Button, Input, message } from 'antd';
import io from 'socket.io-client';
import EditorRoom from './EditorRoom';
import { socketAddress } from '../../config';
import { observer, inject } from "mobx-react";
let socket;

function createSocket() {
	socket = io.connect(socketAddress);
}
@inject("homeStore")
@observer
class Room extends React.Component {



	inputChange = e => {
		const { homeStore } = this.props
		const { isroom, setIsroom, setRoomId, } = homeStore
		setRoomId(e.target.value)
		console.log(e.target.value)
	};

	createRoom = () => {
		const { homeStore } = this.props
		const { isroom, setIsroom, setRoomId, setRoomInfo } = homeStore
		console.log(homeStore)
		if (!localStorage['token']) {
			message.warn('请先登录 ');
			return;
		}
		createSocket();
		socket.emit('create room', {
			userId: localStorage['userId'],
			nickname: localStorage['nickname'],
			avatar: localStorage['avatar']
		});

		socket.on('create room result', res => {
			const { status, msg, data, reset } = res;
			if (status === 0) {
				let { roomInfo } = data;
				const { roomId } = roomInfo;
				setRoomInfo(roomInfo)
				setRoomId(roomId)
				setIsroom()
			} else {
				message.error(msg);
			}
		});
	};

	enterRoom = () => {
		const { homeStore } = this.props
		const { isroom, setIsroom, roomId, setRoomInfo, roomInfo } = homeStore
		if (!localStorage['token']) {
			message.warn('Please login first');
			return;
		}
		if (!roomId && !isroom) {
			message.warn('Please enter the room ID');
			return;
		}
		createSocket();
		socket.emit('enter room', {
			roomId: roomId,
			userId: localStorage['userId'],
			nickname: localStorage['nickname'],
			avatar: localStorage['avatar']
		});

		socket.on('enter room result', res => {
			let { status, msg, data } = res;
			if (status === 0) {
				setRoomInfo(data.roomInfo)
				setIsroom()
			}

			if (status === 1) {
				message.error(msg);
				socket.close();
			}
		});
	};

	exitRoom = () => {
		const { homeStore } = this.props
		const { isroom, resetIsroom, resetRoomId, reset } = homeStore
		socket.close();
		reset()
	};

	render() {
		const { homeStore } = this.props
		const { roomId, isroom, resetIsroom, resetRoomId, roomInfo } = homeStore
		console.log(roomInfo, 'fuck')
		return (
			<div>
				{(!isroom) ? (
					<div className="room-mode txt-center">
						<h1 className="room-mode-title">Multiplayer editing mode</h1>
						<p>Allows multiple people to share an editor in real time</p>
						<div className="begin-btns">
							<div className="input-btn">
								<div className="input-wrap">
									<Input value={roomId} onChange={this.inputChange} style={{ width: '120px' }} />
								</div>
								<Button type="primary" onClick={this.enterRoom}>Enter the room</Button>
							</div>
							<div className="txt-or">or</div>
							<div>
								<Button type="primary" onClick={this.createRoom}>Create a room</Button>
							</div>
						</div>
					</div>
				) : (
					<EditorRoom
						socket={socket}
						exitRoom={this.exitRoom} />
				)}
			</div>
		);
	}
}


export default Room;