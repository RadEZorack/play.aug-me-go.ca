async function initDatbaseRefs(){
    database.ref('userInput/'+myUid).onDisconnect().set(false);

    await database.ref('/chunkOutput/123/userOutput').on('child_added', async (data) => {
        // Connect webrtc
        const message = data.val();
        
        if (message.uid != myUid){
            update_entity(message);
        }
    })
    await database.ref('/chunkOutput/123/userOutput').on('child_changed', async (data) => {
        const message = data.val();
        
        if (message.uid != myUid){
            update_entity(message);
        }
    })

    await database.ref('/chunkOutput/123/userOutput').on('child_removed', async (data) => {
        data = data.val();
        await database.ref(`/userTo/${data.uid}/userFrom/${myUid}`).set(null);
        await database.ref(`/userTo/${myUid}/userFrom/${data.uid}/messages`).set(null);
        await database.ref(`/userTo/${myUid}/userFrom/${data.uid}`).set({ready: true});
        
        if (data.uid != myUid){
            remove_entity(data)
        }

        
    })
    
}