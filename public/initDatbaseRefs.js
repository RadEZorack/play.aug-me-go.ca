async function initDatbaseRefs(){
    database.ref('userInput/'+myUid).onDisconnect().set(false);

    await database.ref('/chunkOutput/123/userOutput').on('child_added', (data) => {
        // Connect webrtc
        const message = data.val();

        if (message.uid != myUid){
            remove_entity(message)
        }
        
        if (message.uid != myUid){
            update_entity(message);
        }
    })
    await database.ref('/chunkOutput/123/userOutput').on('child_changed', (data) => {
        const message = data.val();
        
        if (message.uid != myUid){
            update_entity(message);
        }
    })

    await database.ref('/chunkOutput/123/userOutput').on('child_removed', (message) => {
        message = message.val();

        database.ref(`/userTo/${message.uid}/userFrom/${myUid}`).set(null);

        database.ref(`/userTo/${myUid}/userFrom/${message.uid}`).set(null);
        
        if (message.uid != myUid){
            remove_entity(message)
        }

        
    })
    
}