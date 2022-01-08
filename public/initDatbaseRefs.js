function initDatbaseRefs(){
    database.ref('/chunkOutput/123/userOutput').on('child_changed', (data) => {
        const message = data.val();
        
        if (message.uid != myUid){
            update_entity(message);
        }
    })
}