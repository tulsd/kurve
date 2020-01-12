class Communicator
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(server_url, server_port, logger, game)
  {
    // Message register
    this.register_ = {};

    // General
    this.logger_              = logger;
    this.game_                = game;

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

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Handle events

  onOpen(event)
  {
    this.logger_.log(1, 'WebSocket open');
    this.connection_open_ = true;
  }

  onMessage(event)
  {
    this.logger_.log(2, 'WebSocket message receive');

    // Unpack message
    let message = JSON.parse(event.data);
    let m_type = message.type;

    // Create player array if never created before
    if(this.register_[m_type] == undefined)
    {
      this.register_[m_type] = new Set();
    }

    // Give message to registered players
    let event_target = this;
    this.register_[m_type].forEach(
      function(message_target)
      {
        message_target.handleMessage(message);
      }
    );
  }

  onClose(event)
  {
    this.logger_.log(1, 'WebSocket close');
    this.game_.resetGame();
    this.game_.ui_handler_.generateAlert('Connection lost', 'The server disconnected. Please come back later.', false);
  }

  onError(event)
  {
    this.logger_.log(1, 'WebSocket error');
    this.game.resetGame()
    this.game_.ui_handler_.generateAlert('Connection lost', 'The server disconnected. Please come back later.', false);
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for receiving

  registerToMessageType(type, message_target)
  {
    // Create player array if never created before
    if(this.register_[type] == undefined)
    {
      this.register_[type] = new Set();
    }

    this.register_[type].add(message_target);
  }

  unregisterFromMessageType(type, message_target)
  {
    if(this.register_[type] == undefined)
    {
      return true;
    }

    this.register_[type].delete(message_target);
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods for sending

  sendMessage(type, destination, content)
  {
    this.logger_.log(2, 'WebSocket message send');

    let message =
    {
      type: type,
      destination: destination,
      content: content,
    };

    this.websocket_.send(JSON.stringify(message));
  }
}
