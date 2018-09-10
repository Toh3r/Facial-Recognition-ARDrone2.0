$(document).ready(function() 
{
  
  var socket = io.connect();

  $(document).keyup(function(e) 
  {

    e.preventDefault();

    //Takeoff = t
    if(e.keyCode == 84) {
      socket.emit('takeoff');
    }  

    //Land = l
    if(e.keyCode == 76) {
      socket.emit("land");  
    }

    //Stop = h
    if(e.keyCode == 72) {
      socket.emit("stop");  
    }

    // Stop moving forward = w
    if(e.keyCode == 87) {
      socket.emit('stop');
    } 

     //Stop moving back = s
    if(e.keyCode == 83) {
      socket.emit('stop');  
    } 

    //Stop moving left = a
    if(e.keyCode == 65) {
      socket.emit('stop');  
    }

    //Stop moving right = d
    if(e.keyCode == 68) {
      socket.emit('stop');  
    } 

    //Stop moving up = up arrow
    if(e.keyCode == 38) {
      socket.emit('stop');  
    } 

    //Stop moving down = down arrow
    if(e.keyCode == 40) {
      socket.emit('stop');  
    }       

    //Stop rotating right = ->
    if(e.keyCode == 39) {
      socket.emit('stop');  
    }  

    //Stop rotating left = <-
    if(e.keyCode == 37) {
      socket.emit('stop');  
    }      
  });


  //key down
  $(document).keydown(function(e) {

    //Move forward = w
    if(e.keyCode == 87) {
      socket.emit('forward');
    } 

    //Move back = s
    if(e.keyCode == 83) {
      socket.emit('backward');  
    }

    //Move left = a
    if(e.keyCode == 65) {
      socket.emit('left');  
    }

    //Move right = d
    if(e.keyCode == 68) {
      socket.emit('right');  
    } 

    //Move up = up arrow
    if(e.keyCode == 38) {
      socket.emit('up');  
    } 

    //Move down = down arrow
    if(e.keyCode == 40) {
      socket.emit('down');  
    }      

    //Move clockwise = ->
    if(e.keyCode == 39) {
      socket.emit('clockwise');  
    }  

    //Move anti-clockwise = <-
    if(e.keyCode == 37) {
      socket.emit('counterclockwise');  
    }    

    //Give a wave = m
    if(e.keyCode == 77) {
      socket.emit('wave');  
t    }    

  });

});


