//Initialize buttons
function init(){
	
}

function getJSON(path, callback){
	var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {

            if (httpRequest.status === 200) {

            	//console.log(httpRequest.responseText);
                var data = (JSON.parse(httpRequest.responseText));
                callback(data);
            }else{
            	console.log('Failed to find json');
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
} 

function populatePlaylists(path) {
	getJSON(path, function(data){	
		//Based off of http://stackoverflow.com/questions/11128700/create-a-ul-and-fill-it-based-on-a-passed-array
    	// Create the list element:
    	var plist = document.createElement("ul");

    	for(var i = 0; i < data.length; i++) {
        	// Create the list item:
        	var item = document.createElement('li');
        	// Set its contents:
        	var albumImg = document.createElement('span');
    		albumImg.className="glyphicon glyphicon-unchecked";

    		var playButton = document.createElement('span');
        	playButton.className ="glyphicon glyphicon-chevron-right"; 
        	playButton.songName = data[i].name;
        	
        	var playlistName = document.createElement('span');        	
        	playlistName.appendChild(document.createTextNode(data[i].name));
        	item.appendChild(albumImg);
        	item.appendChild(playlistName);
        	item.appendChild(playButton);

        	// Add it to the list:
        	plist.appendChild(item);
    	}
    	// Finally, return the constructed list:
  		document.body.appendChild(plist);
  		setActive('plistbutton');

  		//Add play button functionality
  		document.getElementById('playbutton').onclick=function(){addPlaylist();};
  	});}

function addPlaylist(){
	 var newPlaylist = prompt("Enter new playlist name : ", "");
	 getJSON('/api/playlists', function(data){
		var playlistJSON = ('{"id": ' + data.playlists.length + ', "name": "' + newPlaylist + '", "songs": []}');
		playlistJSON = JSON.parse(playlistJSON);
	 	data.push(playlistJSON);
	 	console.log(data);
	 	//Send off
	 	var httpRequest = new XMLHttpRequest();
    	httpRequest.onreadystatechange = function() {
        	if (httpRequest.readyState === 4) {

            	if (httpRequest.status === 200) {
                	
            	}else{
            	console.log('Failed to load json');
            	}
        	}
    	};
    	httpRequest.open('POST', '/playlists');
   	 	httpRequest.send(JSON.stringify(data));
   	 	window.open("/playlists", "_self")
	 });
}

function generateSongList(array){
	var sList = document.createElement('ul');
	for (var i = 0; i < array.length; i++) {
		var newSong = document.createElement('li');
		newSong.appendChild(generateSong(array[i].title, array[i].artist, array[i].id));
		sList.appendChild(newSong);
	}
	setActive('libbutton');
	return sList
}

function getPlayList(playlistName){
	//Find the playlist data
	var allPlaylists = window.MUSIC_DATA.playlists;
	var correctList = null;
	for (var i = 0; i < allPlaylists.length; i++) {
		if(allPlaylists[i].name == playlistName){
			correctList = allPlaylists[i];
		}
	}
	if(correctList === null){
		console.log("Failed to find the correct playlist")

		return null;
	}
	//Add songs to list
	var allSongs = window.MUSIC_DATA.songs;

	var playlistContents = new Array(correctList.songs.length);
	for (var i = 0; i < correctList.songs.length; i++) {
		for (var j = 0; j < allSongs.length; j++) {
			if(allSongs[j].id == correctList.songs[i]){
				playlistContents[i] = allSongs[j];
				continue; //found, break this loop
			}
		}
	}
	//Generate list and add to screen
	var slist = generateSongList(playlistContents);

	document.getElementById("songList").innerHTML = "";
	document.getElementById("songList").appendChild(slist);
	document.getElementById("sortHeader").style.visibility="hidden";
	document.getElementById("plistname").appendChild(document.createTextNode(correctList.name));
	document.getElementById("plistname").style.visibility="visible";
	//openWindow(document.getElementById("lib"));

}

function generateSong(name, artist, id){ //returns song object
	var song = document.createElement('div');
	var songImg = document.createElement('span');
    songImg.className="glyphicon glyphicon-unchecked";
    var songInfo = document.createElement('span');
    	var stitle = document.createElement('h5');
    	stitle.className="songTitle";
		stitle.appendChild(document.createTextNode(name));
		songInfo.appendChild(stitle);
		
    	var artistLine = document.createElement('h6');
    	artistLine.className="ArtistLine";
    	artistLine.appendChild(document.createTextNode(artist));
    	songInfo.appendChild(artistLine);
    var playSong = document.createElement('span');
    playSong.className="glyphicon glyphicon-play";	


    var atp = document.createElement('span');
    atp.className="glyphicon glyphicon-plus-sign";	
    atp.sid=id;

    song.appendChild(songImg);
    song.appendChild(songInfo);
    song.appendChild(playSong);
    song.appendChild(atp);

	return song;
}

function songsByTitle(path){
	getJSON(path, function(data){
		var songs = data;
		console.log(data);
			var sortedSongs = songs.sort(function(a, b){
			var s1 = a.title;
			if(s1.startsWith("The ")){
				s1 = s1.substring(4, s1.length);
			}
			var s2 = b.title;
			if(s1.startsWith("The ")){
				s2 = s2.substring(4, s2.length);
			}
			if(s1 > s2){return 1;}else{return -1;}
		});

		var ssongs = generateSongList(sortedSongs);
		document.getElementById("songList").innerHTML = "";
		document.getElementById("songList").appendChild(ssongs);
		//setModal();
	});
	//openWindow(document.getElementById("lib"));

}

function songsByArtist(songs){
	var sortedSongs = songs.sort(function(a, b){
		var s1 = a.artist;
		if(s1.startsWith("The ")){
			s1 = s1.substring(4, s1.length);
		}
		var s2 = b.artist;
		if(s1.startsWith("The ")){
			s2 = s2.substring(4, s2.length);
		}
		if(s1 > s2){return 1;}else{return -1;}

	})
	var ssongs = generateSongList(sortedSongs);
	document.getElementById("songList").innerHTML = "";

	document.getElementById("songList").appendChild(ssongs);
	o//penWindow(document.getElementById("lib"));

}

function setActive(buttonName){
	document.getElementById('libbutton').className="";
	document.getElementById('plistbutton').className="";
	document.getElementById('srchbutton').className="";
	document.getElementById(buttonName).className="active";
}

function addToPlaylist(id){
	getJSON('/api/playlists', function(data){
		lists = data.playlists;
		for (var i = 0; i < lists.length; i++) {
			var choice = document.createElement('div');
			document.createTextNode(lists[i].name);
			choice.onclick = function(){
				data.playlists.songs.push(id);
				document.getElementById('myModal').style.display = "none";
				var httpRequest = new XMLHttpRequest();
    		httpRequest.onreadystatechange = function() {
        	if (httpRequest.readyState === 4) {

            	if (httpRequest.status === 200) {
                	
            	}else{
            	console.log('Failed to load json');
            	}
        	}
        	choices.appendChild(choice);
    	};
    	httpRequest.open('POST', '/playlists');
   	 	httpRequest.send(JSON.stringify(data));
			};
			
		}
	});
	
}



/*
function setModal(){
	// Get the modal
	var modal = document.getElementById('myModal');

	// When the user clicks on the button, open the modal 
	var playlistButtons = document.getElementsByClassName("glyphicon glyphicon-plus-sign");
	for (var i = 0; i < playlistButtons.length; i++) {
		playlistButtons[i].onclick = function() {
    		modal.style.display = "block";
    		addToPlaylist(playlistButtons[i].sid);
		}
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
    	    modal.style.display = "none";
    	}
	}
	modal.appendChild(choices);
}*/


