var subRooms = []

Object.defineProperty(subRooms, 'last', {
    get: function()
    {
      return this[this.length-1]
    }})


Object.defineProperty(subRooms, 'add', {
    set: function(roomId)
    {
        var index = this.indexOf(roomId);
        if(index === -1)
        {
            this.push(roomId);
            console.log("[Server|subRooms] Added new room id: " + roomId);
        }
    }})

Object.defineProperty(subRooms, 'remove', {
    set: function(roomId)
    {
        var index = this.indexOf(roomId);
        if(index != -1)
        {
            console.log("[Server|subRooms] Removing room id: " + roomId);
            this.splice(index,1);        
        }
    }})

exports.roomArray = subRooms;