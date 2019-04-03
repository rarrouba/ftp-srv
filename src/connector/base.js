const Promise = require('bluebird');
const errors = require('../errors');

class Connector {
  constructor(connection) {
    this.connection = connection;

    this.dataSocket = null;
    this.dataServer = null;
    this.type = false;
  }

  get log() {
    return this.connection.log;
  }

  get socket() {
    return this.dataSocket;
  }

  get server() {
    return this.connection.server;
  }

  waitForConnection() {
    return Promise.reject(new errors.ConnectorError('No connector setup, send PASV or PORT'));
  }

  closeSocket() {
    if (this.dataSocket) {
      const socket = this.dataSocket;
      this.dataSocket.end(() => socket.destroy());
      this.dataSocket = null;
    }
  }

  closeServer(callback) {
    if (this.dataServer) {
      this.dataServer.close(callback);
      this.dataServer = null;
    }
  }


  end(callback) {
    this.closeSocket();
    this.closeServer(callback);

    this.type = false;
    this.connection.connector = new Connector(this);
  }
}
module.exports = Connector;
