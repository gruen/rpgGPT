const chatWindow = document.getElementById('chat-window');
const inputChat = document.getElementById('input-message');
const sendBtn = document.getElementById('send-btn');
const healthScore = document.getElementById('health-score');
const moneyScore = document.getElementById('money-score');
const fightBtn = document.getElementById('fight-btn');
const itemsBtn = document.getElementById('items-btn');
const targetBtn = document.getElementById('target-btn');
const actionsContainer = document.querySelector('.actions-container')
const fightContainer = document.querySelector('.fight-container');
const itemsContainer = document.querySelector('.items-container');
const targetContainer = document.querySelector('.target-container');

function setButtonStates(state) {
  sendBtn.disabled = !state;
  inputChat.disabled = !state;
  fightBtn.disabled = !state;
  itemsBtn.disabled = !state;
  targetBtn.disabled = !state;
}

function showContainer(container) {
    const containers = [fightContainer, itemsContainer, targetContainer];
    containers.forEach((c) => {
        if (c === container) {
            c.hidden = false;
            c.style.display = 'flex';
        } else {
            c.hidden = true;
        }
    });
}

function createUserMessageElement(message) {
    const userDetailsDiv = document.createElement('div');
    userDetailsDiv.classList.add('user-details');
  
    const userNameDiv = document.createElement('div');
    userNameDiv.classList.add('user-name');
    userNameDiv.innerText = message.userName;
    userDetailsDiv.appendChild(userNameDiv);
  
    const userMessageDiv = document.createElement('div');
    userMessageDiv.classList.add('user-message');
    userMessageDiv.innerText = message.message;
    userDetailsDiv.appendChild(userMessageDiv);
  
    return userDetailsDiv;
  }
  
  function createActionMessageElement(message) {
    const actionMessageDiv = document.createElement('div');
    actionMessageDiv.classList.add('action-message');
    actionMessageDiv.innerText = message.message;
  
    if (message.triggers) {
      const changeHealthTrigger = message.triggers.find(trigger => 'change_health' in trigger);
      if (changeHealthTrigger) {
        const healthChange = changeHealthTrigger.change_health[1];
        const heartIcon = document.createElement('img');
        heartIcon.src = 'media/icons/heart.svg';
        heartIcon.classList.add('health-icon');
        actionMessageDiv.appendChild(heartIcon);
        const healthChangeText = document.createTextNode(` ${healthChange > 0 ? '+' : ''}${healthChange}`);
        actionMessageDiv.appendChild(healthChangeText);
  
        if (healthChange < 0) {
          actionMessageDiv.classList.add('negative-effect');
        } else if (healthChange > 0) {
          actionMessageDiv.classList.add('positive-effect');
        }
      }
    }
  
    return actionMessageDiv;
  }
  
  
  function createGameMessageElement(message) {
    const gameMessageDiv = document.createElement('div');
    gameMessageDiv.classList.add('game-message');
    gameMessageDiv.innerText = message.message;
  
    return gameMessageDiv;
  }
  
  function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
  
    if (message.type === 'game') {
      const gameMessageElement = createGameMessageElement(message);
      messageDiv.appendChild(gameMessageElement);
    } else if (message.type === 'action') {
      const actionMessageElement = createActionMessageElement(message);
      messageDiv.appendChild(actionMessageElement);
    } else {
      const userIconDiv = document.createElement('div');
      userIconDiv.classList.add('user-icon');
      const userIconImg = document.createElement('img');
      userIconImg.src = message.userIcon;
      userIconDiv.appendChild(userIconImg);
      messageDiv.appendChild(userIconDiv);
  
      const userDetailsElement = createUserMessageElement(message);
      messageDiv.appendChild(userDetailsElement);
    }
  
    return messageDiv;
  }
  
function appendMessageElement(messageElement) {
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendChat() {
    const chatStr = inputChat.value.trim();
    if (chatStr) {
      const uiEvent = new CustomEvent('uiEvent', { detail: { type: 'chat', message: chatStr } });
      document.dispatchEvent(uiEvent);
      inputChat.value = '';
      setButtonStates(false);
    }
  }

inputChat.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendChat();
  }
});

sendBtn.addEventListener('click', sendChat);

setButtonStates(false);

document.addEventListener('message', (event) => {
  const { verb, message } = event.detail;
  if (verb === 'POST') {
    const messageElement = createMessageElement(message);
    if (messageElement) {
      appendMessageElement(messageElement);
    }
  } else if (verb === 'DELETE') {
    chatWindow.removeChild(chatWindow.lastChild);
  }
});

function createIcons(container, iconSrc, count) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const icon = document.createElement('img');
      icon.src = iconSrc;
      icon.classList.add('action-icon');
      container.appendChild(icon);
    }
  }

function updateTargetButtons() {
  targetContainer.innerHTML = '';
  const currentLocation = locations[player.location];
  const currentCharacters = currentLocation.characters
  const currentCharactersSorted = currentCharacters.sort((a, b) => a.length - b.length);
  currentCharactersSorted.forEach((characterID) => {
    const character = characters[characterID];
    const characterBtn = document.createElement('button');
    characterBtn.innerText = character.name;
    characterBtn.classList.add('action-button');
    characterBtn.addEventListener('click', () => {
      const uiEvent = new CustomEvent('uiEvent', { detail: { type: 'selection', action: 'target', data: character } });
      document.dispatchEvent(uiEvent);
    });
    targetContainer.appendChild(characterBtn);
  });
}

function updateFightButtons() {
  fightContainer.innerHTML = '';
  playerAttacks.forEach((attack, index) => {
    const attackBtn = document.createElement('button');
    attackBtn.innerText = attack.name;
    attackBtn.id = `AttackBtn${index + 1}`;
    attackBtn.classList.add('action-button');
    attackBtn.addEventListener('click', () => {
      const uiEvent = new CustomEvent('uiEvent', { detail: { type: 'selection', action: 'fight', data: attack } });
      document.dispatchEvent(uiEvent);
    });
    fightContainer.appendChild(attackBtn);
  });
}
  
fightBtn.addEventListener('click', () => {
  showContainer(fightContainer);
  updateFightButtons();
});

itemsBtn.addEventListener('click', () => {
  showContainer(itemsContainer);
  createIcons(itemsContainer, 'media/icons/item.svg', 4);
});

targetBtn.addEventListener('click', () => {
  showContainer(targetContainer);
  updateTargetButtons();
});

document.addEventListener('updateHealthScore', (event) => {
  const { newHealthScore } = event.detail;
  healthScore.innerText = newHealthScore;
});
  