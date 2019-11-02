class Communicator
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup
  constructor(server_url, server_port)
  {
    // Connection
    this.connection_open_     = false;
    this.websocket_           = new WebSocket('ws://' + server_url + ':' + server_port);

    // Connection events
    let event_target = this;
    this.websocket_.onopen    = function(e){event_target.onOpen.call(event_target, e);};
    this.websocket_.onmessage = function(e){event_target.onMessage.call(event_target, e);};
    this.websocket_.onclose   = function(e){event_target.onClose.call(event_target, e);};
    this.websocket_.onerror   = function(e){event_target.onError.call(event_target, e);};
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

    this.websocket_.send(JSON.stringify(message));
  }

  registerToMessageType(type)
  {

  }

  unregisterFromMessageType(type)
  {

  }
}
