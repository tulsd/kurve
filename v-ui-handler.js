class UiHandler
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(container_player_cards, player_local, players_remote)
  {
    // Ui elements
    this.container_player_cards_    = container_player_cards;
    this.player_cards_              = [];

    // Information
    this.player_local_              = player_local;
    this.players_remote_            = players_remote;

    // Generate player cards
    this.generatePlayerCards();
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods

  generatePlayerCards()
  {
    for (let index = 0; index <= 4; index++)
    {
      // Create nodes
      let node_player_card  = document.createElement('div');
      let node_id           = document.createElement('div');
      let node_connection   = document.createElement('div');
      let node_name         = document.createElement('div');

      // Class nodes
      node_player_card.className  = 'playercard';
      node_id.className           = 'id';
      node_connection.className   = 'connection';
      node_name.className         = 'name';

      // Fill nodes
      node_id.appendChild(document.createTextNode('Player ' + index));
      node_connection.appendChild(document.createTextNode('Disconnected'));
      node_name.appendChild(document.createTextNode('---'));

      // Append nodes
      node_player_card.appendChild(node_id);
      node_player_card.appendChild(node_connection);
      node_player_card.appendChild(node_name);

      // Store and display card
      this.player_cards_.push(node_player_card);
      this.container_player_cards_.appendChild(node_player_card);
    }
  }

  updatePlayerCards()
  {

  }
}