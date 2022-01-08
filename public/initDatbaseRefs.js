function initDatbaseRefs(){
    database.ref('userInput/'+myUid).onDisconnect().set(false);

    database.ref('/chunkOutput/123/userOutput').on('child_added', (data) => {
        // Connect webrtc
        const message = data.val();
        
        if (message.uid != myUid){
            update_entity(message);
        }
    })
    database.ref('/chunkOutput/123/userOutput').on('child_changed', (data) => {
        const message = data.val();
        
        if (message.uid != myUid){
            update_entity(message);
        }
    })

    database.ref('/chunkOutput/123/userOutput').on('child_removed', (data) => {
        console.log(data)
        const message = data.val();
        
        if (message.uid != myUid){
            remove_entity(message)
        }
    })
    
}