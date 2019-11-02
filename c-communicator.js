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
    console.log('DEBUG: WebSocket open');
  }

  onMessage(event)
  {
    console.log('DEBUG: WebSocket message receive');
    let message = JSON.parse(event.data);
  }

  // Callable methods

  sendMessage(type, destination, content)
  {
    console.log('DEBUG: WebSocket message send');

    let message =
    {
      type: type,
      destination: destination,
      content: content,
      time: Date.now()
    };

    this.websocket.send(JSON.stringify(message));
  }

  registerToMessageType(type)
  {

  }

  unregisterFromMessageType(type)
  {

  }
}
