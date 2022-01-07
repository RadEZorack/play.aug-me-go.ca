async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
    });
}
function createRecorder(stream, mimeType) {
    // the stream data is stored in this array
    let recordedChunks = [];

    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
        if (e.data.size > 0) {
            recordedChunks.push(e.data);
        }
    };
    mediaRecorder.onstop = function () {
        saveFile(recordedChunks);
        recordedChunks = [];
    };
    mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
    return mediaRecorder;
}
function saveFile(recordedChunks) {

    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });
    let filename = window.prompt('Enter file name'),
        downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.webm`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
}
let mediaRecorder = undefined;
async function startVideo() {
    console.log("Starting screen record.");
    let stream = await recordScreen();
    let mimeType = 'video/webm';
    $("#startButton").hide();
    mediaRecorder = createRecorder(stream, mimeType);
    $("#stopButton").show();
}

async function stopVideo() {
    console.log("Stopping screen record.");
    $("#stopButton").hide();
    mediaRecorder.stop();
    $("#startButton").show();
}