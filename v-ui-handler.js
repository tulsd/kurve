class UiHandler
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(container_player_cards, players_local, players_remote)
  {
    // Ui elements
    this.container_player_cards_    = container_player_cards;
    this.player_cards_              = [];

    // Information
    this.players_local_             = players_local;
    this.players_remote_            = players_remote;

    // Generate player cards
    this.generatePlayerCards();
  }

  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Methods

  generatePlayerCards()
  {
    for (let index = 0; index < 4; index++)
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
      node_id.appendChild(document.createTextNode('Player ' + (index + 1)));
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

  resetPlayerCards()
  {
    let index = 1;
    this.player_cards_.forEach(function(player_card)
    {
      // Fill nodes
      player_card.children[0].textContent = 'Player ' + index;
      player_card.children[1].textContent = 'Disconnected';
      player_card.children[2].textContent = '---';
      player_card.style.borderColor       = '#555';
      index++;
    });
  }

  updatePlayerCards()
  {
    // Update local player
    this.updatePlayerCard(this.players_local_[0].id_);

    // Update remote players
    let event_target = this;
    this.players_remote_.forEach(function(player_remote)
      {
        event_target.updatePlayerCard(player_remote.id_);
      }
    );
  }

  updatePlayerCard(player_id)
  {
    if(this.players_local_[0].id_ == player_id)
    {
      let player_card = this.player_cards_[player_id - 1];
      player_card.children[1].textContent = 'Local';
      player_card.style.borderColor = this.players_local_[0].color_;
    }

    else
    {
      let event_target = this;
      this.players_remote_.forEach(function(player_remote)
        {
          if(player_remote.id_ == player_id)
          {
            let player_card = event_target.player_cards_[player_id - 1];
            player_card.children[1].textContent = 'Connected';
            player_card.style.borderColor = player_remote.color_;
          }
        }
      );
    }
  }
}