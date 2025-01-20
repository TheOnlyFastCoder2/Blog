interface MessageEvent<T = any> extends Event {
  parsedData: T;
}

interface WebSocket extends EventTarget {
  emit(data: string | ArrayBufferLike | Blob | ArrayBufferView | object): void;
  pingPong (action:"onopen"|"onmessage"|"onerror"|"onclose", data: string | ArrayBufferLike | Blob | ArrayBufferView | object): Promise<MessageEvent<any>>
}

