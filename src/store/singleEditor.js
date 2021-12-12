import { action, observable, makeObservable } from "mobx";


class Store {
    constructor() {
        makeObservable(this, {
            activeStdPanel: observable,
            language: observable,
            stdin: observable,
            runBtnLoading: observable,
            runState: observable,
            runStateTxt: observable,
            runTime: observable,
            runMemory: observable,
            runStdout: observable,
            errorTxt: observable,
            setActiveStdPanel: action,
            setLanguage: action,
            setStdin: action,
            setRunBtnLoading: action,
            setRunState: action,
            setStateText: action,
            setRunMemory: action,
            setRunTime: action,
            setErrorTxt: action,
            setRunStdout: action,
            beforeSummit: action,
            runSuccess: action,
            status1Or2: action,
            statusLarger2: action,
            runError: action,
            reset: action
        })
    }
    code = null
    activeStdPanel = '1'
    language = 'C'
    stdin = ''
    runBtnLoading = false
    runState = -2
    runStateTxt = 'Not started'
    runTime = ''
    runMemory = ''
    runStdout = ''
    errorTxt = ''
    setCode = (code) => {
        this.code = code
    }
    setActiveStdPanel = (value) => {
        this.activeStdPanel = value
    }
    setLanguage = (value) => {
        this.language = value
    }
    setStdin = (value) => {
        this.stdin = value
    }
    setRunBtnLoading = (vaule) => {
        this.runBtnLoading = vaule
    }
    setRunState = (value) => {
        this.runState = value
    }

    setStateText = (value) => {
        this.runStateTxt = value
    }

    setRunTime = (value) => {
        this.runTime = value
    }

    setRunMemory = (value) => {
        this.runMemory = value
    }

    setRunStdout = (value) => {
        this.runStdout = value
    }

    setErrorTxt = (value) => {
        this.errorTxt = value
    }

    reset = () => {
        this.code = null
        this.activeStdPanel = '1'
        this.stdin = ''
        this.runBtnLoading = false
        this.runState = -2
        this.runStateTxt = 'Not started'
        this.runTime = ''
        this.runMemory = ''
        this.runStdout = ''
        this.errorTxt = ''
    }
    beforeSummit = () => {
        this.activeStdPanel = '2'
        this.runBtnLoading = true
        this.runStateTxt = 'img'
        this.runState = -1
        this.runTime = ''
        this.runMemory = ''
        this.runStdout = ''
        this.errorTxt = ''
    }
    runSuccess = (status, time, memory, stdout) => {
        this.runStateTxt = 'Success'
        this.runState = status
        this.runTime = time
        this.runMemory = memory
        this.runStdout = stdout
    }
    status1Or2 = (msg, status, error) => {
        this.runStateTxt = msg
        this.runState = status
        this.errorTxt = error
    }
    statusLarger2 = (status, msg) => {
        this.runStateTxt = 'An error has occurred'
        this.runState = status
        this.errorTxt = msg
    }
    runError = (error) => {
        this.runState = -3
        this.runStateTxt = 'Network error'
        this.runBtnLoading = false
        this.errorTxt = error
    }
}

export default Store