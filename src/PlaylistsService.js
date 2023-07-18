const { Pool } = require('pg');

class PlaylistsService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylistSongs(id) {
        const queryPlaylist = {
            text: 'SELECT id, name FROM playlists WHERE id = $1',
            values: [id],
        };

        const querySongs = {
            text: `SELECT A.id, A.title, A.performer FROM songs A
            JOIN playlist_songs B ON A.id = B.song_id
            WHERE B.playlist_id = $1`,
            values: [id],
        };

        const resultPlaylist = await this._pool.query(queryPlaylist);
        const resultSongs = await this._pool.query(querySongs);

        return { playlist: { ...resultPlaylist.rows[0], songs: resultSongs.rows } };
    }
}

module.exports = PlaylistsService;