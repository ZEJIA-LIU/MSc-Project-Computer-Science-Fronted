import { action, observable, makeObservable } from "mobx";
class HomeStore {
    constructor() {
        makeObservable(this, {
            roomId: observable,
            isroom: observable,
            roomInfo: observable,
            setRoomInfo: action,
            setRoomId: action,
            resetRoomId: action,
            reset: action,
            setIsroom: action,
            resetIsroom: action,
            setUsers: action,
            setEditorUser: action,
            releaseEditor: action,
            setEitorCode: action,
            setMsgList: action,
            setEditorStatus: action,
        })
    }
    code = ''
    roomId = ''
    isroom = false
    roomInfo = {
        roomId: '',
        userList: {},
        userListArr: [],
        userCount: 1,
        editorCode: '',
        editorUser: null,
        msgList: [],
        editorStatus: {},
        activePanel: '1',
        isRunning: false,
        stdin: '',
        runResult: {}
    }
    setEditorStatus = (status) => {
        this.roomInfo.editorStatus = status
    }
    setMsgList = (list) => {
        this.roomInfo.msgList = list
    }
    setEitorCode = (code) => {
        this.roomInfo.editorCode = code
    }
    _setEitorCode = (code) => {
        this.code = code
    }
    setUsers = (userList, userListArr) => {
        this.roomInfo.userListArr = userListArr,
            this.roomInfo.userList = userList
    }

    setEditorUser = (userinfo) => {
        this.roomInfo.editorUser = userinfo
    }
    releaseEditor = () => {
        this.roomInfo.editorUser = null
    }

    setRoomInfo = (newInfo) => {
        this.roomInfo = newInfo
    }
    setRoomId = (newId) => {
        this.roomId = newId
    }

    resetRoomId = () => {
        this.roomId = ''
    }

    reset = () => {
        this.isroom = false
        this.roomId = ''
        this.code = ''
        this.roomInfo = {
            roomId: '',
            userList: {},
            userListArr: [],
            userCount: 1,
            editorCode: '',
            editorUser: null,
            msgList: [],
            editorStatus: {},
            activePanel: '1',
            isRunning: false,
            stdin: '',
            runResult: {}
        }
    }
    setIsroom = () => {
        this.isroom = true
    }

    resetIsroom = () => {
        this.isroom = false
    }

}
export default HomeStore;