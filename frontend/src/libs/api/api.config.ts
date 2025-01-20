import axios  from 'axios';

export const headers = {
  "Accept": "application/json",
  "Access-Control-Allow-Origin": "https://localhost:4200",
  "Content-Type": "application/json; charset=UTF-8",
}

export const config = {
  baseURL: "http://localhost:4200/api",
  headers: {
    ...headers,
  }
}

export const instance = axios.create({
    baseURL: config.baseURL,
    headers
});


WebSocket.prototype.emit = function (data) {
 this.send(JSON.stringify(data));
};

WebSocket.prototype.pingPong = function (action, data) {  
  this[action] = () => this.emit(data)

  return new Promise((resolve) => {
    this.onmessage = async (ev) => {
      ev.parsedData = await JSON.parse(ev.data);
      resolve(ev);
    }
  })
}

export const socket = (path: string) => (
  (params?:string) => (
    !params
    ? new WebSocket(`ws://localhost:4200/api/ws/${path}`)
    : new WebSocket(`ws://localhost:4200/api/ws/${path}/${params}`)
  )
);