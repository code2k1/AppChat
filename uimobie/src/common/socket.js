import * as SecureStore from "expo-secure-store";
import { io } from "socket.io-client";
const Socket = {
  connect,
  emit,
  on,
  removeListener,
  socket: null,
};

/* eslint-enable no-use-before-define */

async function connect() {
  // if (!(await SecureStore.getItemAsync("secure_token"))) {
  //   // Setup a server for testing.
  //   Socket.socket = io.connect("http://172.16.20.170:4001", {
  //     reconnect: true,
  //   });
  // }
  Socket.socket = io.connect("http://172.16.20.170:4001", {
    reconnect: true,
  });
}

connect();

function on(eventName, callback) {
  if (Socket.socket) {
    Socket.socket.on(eventName, (data) => {
      callback(data);
    });
  }
}

function emit(eventName, data) {
  if (Socket.socket) {
    Socket.socket.emit(eventName, data);
  }
}

function removeListener(eventName) {
  if (Socket.socket) {
    Socket.socket.removeListener(eventName);
  }
}

export default Socket;
