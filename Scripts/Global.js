const { ipcRenderer, app } = require("electron")

const MainDisplay = document.getElementById("MainDisplay")
const Status = document.getElementById("Status")
const DownloadDisplay = document.getElementById("DownloadDisplay")
const DefaultTask = document.getElementById("DefaultTask")
const SideBar = document.getElementById("SideBar")
const ControlTools = document.getElementById("ControlTools")

var TaskList = []
var TaskNum = []

// 接收来自主进程的下载信号
ipcRenderer.on("StartDownload", (event, args) => {
    // 添加任务编号
    const TaskID = TaskNum.length
    TaskList[args] = TaskID
    TaskNum.push(TaskID)
    var Task = DefaultTask.cloneNode(true)
    DownloadDisplay.insertBefore(Task, DefaultTask)
    Task.id ="Task-" + TaskID
    console.log("Init:", args ,TaskID, TaskList, TaskNum, TaskList[args])
    // 回复任务编号给主进程
    ipcRenderer.send("TaskID", TaskID)

    // 绑定函数
    console.log("#" + Task.id+" #PauseBtn")
    const PauseBtn = document.querySelector("#" + Task.id+" #PauseBtn")
    console.log(PauseBtn)
    const CancelBtn = document.querySelector("#" + Task.id+" #CancelBtn")
    console.log(CancelBtn)

    PauseBtn.onclick = function () {
        ipcRenderer.send("PauseTask")
    }

    CancelBtn.onclick = function () {
        Task.remove()
        ipcRenderer.send("CancelTask")
    }
})

// 接收来自主进程的初始化下载任务信号
// ipcRenderer.on("InitTask", (event, args) => {
//     const TaskID = args[0]
//
//
//     console.log("InitTask:", TaskID, FileName)
//     // 获取Icon
//     // const Icon = getFileIcon(FileName)
//     // console.log(Icon)
//     // 获取对象
//     const TaskSelector = "#Task-" + TaskID
//
//     const FileIcon = document.querySelector(TaskSelector + " #FileIcon")
//     // 更新界面
//
//     FileSizeSpan.innerHTML = "0B/" + FileSize + "B"
//     // FileIcon.src = Icon
// })

// 接收来自主进程的更新界面信号
ipcRenderer.on("UpdateData", (event, args) => {
    const FileName = args[4]
    const TaskID = TaskList[FileName]
    const speed = args[0] + "B/s"
    const progress = args[1]
    const ReceivedAndTotal = args[2] + "B/" + args[3] + "B"
    console.log("UpdateData:", FileName, TaskID, speed, ReceivedAndTotal)
    // 获取对象
    const TaskSelector = "#Task-" + TaskID
    const FileSizeSpan = document.querySelector(TaskSelector + " #DownloadedSize")
    const ProgressBar = document.querySelector(TaskSelector + " #ProgressBar")
    const DownloadSpeed = document.querySelector(TaskSelector + " #DownloadSpeed")
    const FileNameSpan = document.querySelector(TaskSelector + " #FileName")
    // 更新界面
    FileNameSpan.innerHTML = "文件名: " + FileName
    FileSizeSpan.innerHTML = ReceivedAndTotal
    ProgressBar.value = progress
    DownloadSpeed.innerHTML = speed
})

// 监听器
MainDisplay.addEventListener("did-start-loading", loadstart)
MainDisplay.addEventListener("did-frame-navigate", frameNavigate)

function loadstart() {
    Status.innerHTML = "Loading..."
    console.log("LoadStart")
}

function frameNavigate(e) {
    Status.innerHTML = "Response Code:" + e.httpResponseCode
    console.log("FrameNavigate")
}

// 实现Tools的函数
function DownloadManager() {
    console.log(MainDisplay.style.display)
    MainDisplay.style.display = "none"
    DownloadDisplay.style.display = "inline-flex"
}

// 控制WebView函数
function Back() {
    MainDisplay.style.display = ""
    DownloadDisplay.style.display = "none"
    MainDisplay.goBack()
    console.log("向后")
}

function Forward() {
    MainDisplay.style.display = ""
    DownloadDisplay.style.display = "none"
    MainDisplay.goForward()
    console.log("向前")
}

function Refresh() {
    MainDisplay.reload()
}

function LoadURL(url) {
    MainDisplay.style.display = ""
    DownloadDisplay.style.display = "none"
    MainDisplay.loadURL(url)
}

function OpenBeggingPage () {
    LoadURL('https://seelevollerei.sharepoint.com/:x:/s/seelevollerei/Ed_xUqHmmcVMiTaZGBGeXrMBSUJIJHvTJPIgjAgM_QmFfQ?e=9cvf8R')
    // MainDisplay.executeJavaScript("const Header = document.getElementById(\"Header\")\n" +
    //     "const Ribbon = document.getElementById(\"Ribbon\")\n" +
    //     "const BusinessBar = document.getElementById(\"BusinessBar\")\n" +
    //     "const AdditionalBars = document.getElementById(\"AdditionalBars\")\n" +
    //     "Header.remove()\n" +
    //     "Ribbon.remove()\n" +
    //     "BusinessBar.remove()\n" +
    //     "AdditionalBars.remove()", false)
}

// const Header = document.getElementById("Header")
// const Ribbon = document.getElementById("Ribbon")
// const BusinessBar = document.getElementById("BusinessBar")
// const AdditionalBars = document.getElementById("AdditionalBars")
// Header.remove()
// Ribbon.remove()
// BusinessBar.remove()
// AdditionalBars.remove()

// 隐藏功能
function そら() {
    var HideTools = document.createElement("div")
    SideBar.insertBefore(HideTools, ControlTools)
    HideTools.className = "Tools"
    HideTools.id = "HideTools"

    HideTools.innerHTML = '        <p>隐藏功能</p>\n' +
        '        <a href="javascript:" onclick="LoadURL(\'https://seelevollerei-my.sharepoint.com/:f:/g/personal/rbq_seelevollerei_onmicrosoft_com/Ep5HkKkJ3whHg683n9NxE4UByEyBXqOEPWZ-EDvkZ608Dw\')">\n' +
        '            <div class="Option"><img src="./Resources/存款.svg" alt="">鸢鸢の仓库</div>\n' +
        '        </a>' +
        '        <a href="javascript:" onclick="LoadURL(\'https://seelevollerei.sharepoint.com/:f:/s/seelevollerei/EoWF1q3ubPNLpNJfdcvLY5gBws2t3s58x4-tT99dayH-2Q\')">\n' +
        '            <div class="Option"><img src="./Resources/关于.svg" alt="">睎の博物馆</div>\n' +
        '        </a>' +
        '        <a href="javascript:" onclick="LoadURL(\'https://seelevollerei.sharepoint.com/:f:/s/seelevollerei/EtHpnGIU-pBIkei2gN5ZMqYBxS0EzVNrXIYLxqZF39tgnQ\')">\n' +
        '            <div class="Option"><img src="./Resources/分享.svg" alt="">资源共享中心</div>\n' +
        '        </a>'
}
