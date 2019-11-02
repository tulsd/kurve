class Communicator
{
  constructor(server_url, server_port)
  {
    this.connection_open_     = false;
    this.websocket            = new WebSocket('ws://' + server_url + ':' + server_port);
    let event_target = this;
    this.websocket.onopen     = function(e){event_target.onOpen.call(event_target, e);};
    this.websocket.onmessage  = function(e){event_target.onMessage.call(event_target, e);};
    // TODO: Error, close
  }

  // Handle events

  onOpen(event)
  {
    console.log('DEBUG: WebSocket open');
    console.log(this)
    this.connection_open_ = true;
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
