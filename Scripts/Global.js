// const BackBtn = document.getElementById("BackBtn");
// const ForwardBtn = document.getElementById("ForwardBtn")
// const Control = document.getElementById("ControlBtn")

const MainDisplay = document.getElementById("MainDisplay")
const Status = document.getElementById("Status")
const DownloadDisplay = document.getElementById("DownloadDisplay")
// 监听器
MainDisplay.addEventListener("did-start-loading", loadstart)
MainDisplay.addEventListener("did-frame-navigate", frameNavigate)

function loadstart() {
    Status.innerHTML = "Loading..."
    console.log("LoadStart");
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
    MainDisplay.goBack();
    console.log("向后");
}

function Forward() {
    MainDisplay.style.display = ""
    DownloadDisplay.style.display = "none"
    MainDisplay.goForward();
    console.log("向前");
}

function Refresh() {
    MainDisplay.reload();
}

function LoadURL(url) {
    MainDisplay.style.display = ""
    DownloadDisplay.style.display = "none"
    MainDisplay.loadURL(url);
}