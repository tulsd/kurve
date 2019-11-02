class Communicator
{
  constructor()
  {
    this.websocket = new WebSocket("ws://localhost:8765"); // TODO: Make socket use right IP, not localhost
    this.websocket.onopen = this.onOpen;
    this.websocket.onmessage = this.onMessage;
  }

  // Handle events

  onOpen(event)
  {
    console.log('WS open');
  }

  onMessage(event)
  {
    console.log('WS got message');
  }

  // Callable methods

  sendToServer(type, data)
  {
    let message =
    {
      type: type,
      data: data,
      time: Date.now()
    };

    this.websocket.send(JSON.stringify(message));
  }

  registerToMessageType(type)
  {

  }
}
