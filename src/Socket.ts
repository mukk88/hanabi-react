import * as openSocket from 'socket.io-client';
let socket: SocketIOClient.Socket;

function connect(url: string) {
  socket = openSocket(url);
}

function subscribe(event: string, callback: Function) {
  socket.on(event, (data: string) => callback(JSON.parse(data)));
}

function emit(event: string, data: {}, callback?: Function) {
    socket.emit(event, JSON.stringify(data), function(response: string) {
      if (callback) {
        callback(JSON.parse(response));
      }
    });
}

function onClose(callback: Function) {
  socket.on('disconnect', callback);
}

function onOpen(callback: Function) {
  socket.on('connect', callback);
}

export { 
  connect,
  subscribe,
  emit,
  onClose,
  onOpen,
};