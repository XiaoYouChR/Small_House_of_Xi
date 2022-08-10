const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');

const createWindow = () => {
    const win = new BrowserWindow({
        minWidth: 1200,
        minHeight: 800,
        webPreferences: {
            // preload: path.join(__dirname, 'preload.js'),
            webviewTag: true, // 允许 WebView
            nodeIntegration: true, // 不加，那就都别想活着！
            contextIsolation: false  //  不加，那就都别想活着！
        },
    });

    win.removeMenu()
    win.loadFile('index.html');


// 下载实现
    win.webContents.session.on('will-download', (event, item, webContents) => {

        win.webContents.send("StartDownload", item.getFilename())

        item.TaskID = 0
        var prevReceivedBytes = 0

        // 获取Task编号
        ipcMain.on("TaskID", (e, args) =>{
            item.TaskID = args
            console.log(item.TaskID)
        })
        // 初始化了家人们
        // const FileName = item.getFilename()
        // const FileSize = item.getTotalBytes()

        // win.webContents.send("InitTask", [item.TaskID, item.getFilename(), item.getTotalBytes()])

        ipcMain.on("PauseTask", () => {
            if (item.isPaused() === true) {
                item.resume()
            } else {
                item.pause()
            }
        })

        ipcMain.on("CancelTask", () => {
            item.cancel()
        })

        item.on('updated', (event, state) => {
            const receivedBytes = item.getReceivedBytes()
            // 计算每秒下载的速度
            item.speed = receivedBytes - prevReceivedBytes
            prevReceivedBytes = receivedBytes
            // 进度
            item.progress = item.getReceivedBytes() / item.getTotalBytes()

            // 更新速度
            win.webContents.send("UpdateData", [item.speed, item.progress, receivedBytes, item.getTotalBytes(), item.getFilename()] )
            // win.webContents.send("UpdateData", item )

            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {
                    console.log(`Received bytes: ${item.getReceivedBytes()}`)
                }
            }
        })
        item.once('done', (event, state) => {
            if (state === 'completed') {
                console.log('Download successfully')
            } else {
                console.log(`Download failed: ${state}`)
            }
        })
    })
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
