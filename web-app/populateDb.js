var fs = require('fs');
var models = require('./models');
var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('music.db')

models.sequelize.sync({force: true}).then(function() {

    fs.readFile('./songs.json', function(err, data) {
        var music_data = JSON.parse(data);
        var songs = music_data['songs'];

        songs.forEach(function(song) {
            //console.log(song);
            models.Song.create({
                title: song.title,
                album: song.album,
                artist: song.artist,
                duration: song.duration,
            });
        });
    });

    fs.readFile('./playlists.json', function(err, data) {
        var music_data = JSON.parse(data);
        var playlists = music_data['playlists'];
        console.log(playlists);
        playlists.forEach(function(playlist) {
            models.Playlist.create({
                name: playlist.name
            }).then(function(){
                models.Playlist.findOne({ where: {name: playlist.name} }).then(function(plist) {
                    psongs = playlist.songs;
                    if(psongs != null){
                        psongs.forEach(function(psong){
                                plist.addSong(psong);
                        });
                    }
                })
            });

            
        });
    });

});
