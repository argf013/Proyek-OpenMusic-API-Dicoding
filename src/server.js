/* eslint-disable no-use-before-define */
require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const Response = require('./utils/Response');

const albums = require('./api/albums');
const AlbumsService = require('./services/albums/AlbumsService');
const AlbumValidator = require('./validator/albums');

const songs = require('./api/songs');
const SongsService = require('./services/songs/SongService');
const SongValidator = require('./validator/songs');

const users = require('./api/users');
const UsersService = require('./services/users/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/authentications/AuthenticationsService');
const TokenManager = require('./utils/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

const playlists = require('./api/playlists');
const PlaylistsService = require('./services/playlists/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/collaborations/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const collaborationsService = new CollaborationsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(registerExternalPlugins());

  server.auth.strategy('yess_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register(
    registerPlugins(
      usersService,
      authenticationsService,
      playlistsService,
      collaborationsService,
    ),
  );

  server.ext('onPreResponse', Response.errorHandler());

  await server.start();

  console.log(`Application running on port ${server.info.uri}`);
};

init();

function registerPlugins(
  usersService,
  authenticationsService,
  playlistsService,
  collaborationsService,
) {
  return [
    {
      plugin: albums,
      options: {
        service: new AlbumsService(),
        validator: AlbumValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: new SongsService(),
        validator: SongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        tokenManager: TokenManager,
        validator: CollaborationsValidator,
      },
    },
  ];
}

function registerExternalPlugins() {
  return [
    {
      plugin: Jwt,
    },
  ];
}
