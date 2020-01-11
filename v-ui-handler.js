class UiHandler
{
  // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // Setup

  constructor(container_player_cards, container_alerts, container_stats, players_local, players_remote)
  {
    // Ui elements
    this.container_player_cards_    = container_player_cards;
    this.player_cards_              = [];
    this.container_stats_           = container_stats;
    this.container_alerts_          = container_alerts;

    // Information
    this.players_local_             = players_local;
    this.players_remote_            = players_remote;

    // Stats
    this.win_count_                 = document.createElement("p");
    this.units_traveled_            = document.createElement("p");
    this.win_count_.className       = "truncate";
    this.units_traveled_.className  = "truncate";
    this.container_stats_.appendChild(this.win_count_);
    this.container_stats_.appendChild(this.units_traveled_);

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
      node_id.className           = 'id truncate';
      node_connection.className   = 'connection truncate';
      node_name.className         = 'name truncate';

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

  updateStats(win_count, units_traveled)
  {
    this.win_count_.textContent = "Win count: " + win_count;
    this.units_traveled_.textContent = "Traveled: " + Math.round(units_traveled) + "km";
  }

  generateAlert(text_title, text_content, self_close_after=10)
  {
    // Create nodes
    let node_alert  = document.createElement('div');
    let node_title  = document.createElement('span');
    let node_text   = document.createElement('span');

    // Class nodes
    node_alert.className  = 'alert';
    node_title.className  = 'title';
    node_text.className   = 'text';

    // Fill nodes
    node_alert.appendChild(node_title);
    node_alert.appendChild(node_text);
    node_title.appendChild(document.createTextNode(text_title));
    node_text.appendChild(document.createTextNode(text_content));

    // Add node to container
    this.container_alerts_.appendChild(node_alert);

    // Close alert
    if(self_close_after)
    {
      setInterval(
        function()
        {
          node_alert.remove();
        },
        self_close_after * 1000
      );
    }
  }

  resetAlerts()
  {
    this.container_alerts_.innerHTML = "";
  }
}
