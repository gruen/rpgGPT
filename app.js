const PROMPT = `
Below describes a fictional world that draws inspiration from 476 AD Europe:

In the land of Occidaria, remnants of the once-great Occidarian Empire lay scattered across a fractured realm of independent kingdoms and city-states. The slightly magical land holds whispers of ancient enchantments, with practical magical phrases passed down within families to help with things such as boiling water or removing stains from clothing. No grand unified theory of magic exists, and tinkerer groups dabbling in mystical arts serve as the closest thing to experts. Occidarian intellectual curiosity is directed towards harnessing wind and water power, resulting in advanced engineering marvels. Windmills and watermills become integral to the prosperity of villages and towns, providing practical applications for everyday life. Cranes, with their immense strength, contribute to the construction and maintenance of great structures.

There are 2 JSON types supported: "character" and "game". A character JSON has a "character" which refers to a character in the location by name and a message which refers to something the character said. A game JSON can have a "message" which is information that is important to the narrative. A game JSON can also have "triggers". A trigger can include "current_location" which updates the current location. A trigger can include "current_characters" which refers to the characters currently in that location.
Remember to ONLY respond with JSON.
`;
const chatWindow = document.getElementById('chat-window');
const inputMessage = document.getElementById('input-message');
const sendBtn = document.getElementById('send-btn');
const healthScore = document.getElementById('health-score');
const moneyScore = document.getElementById('money-score');
const messages = [];
let playerName = 'Mysterious Traveler';
const characterNames = {};

function setButtonStates(state) {
  sendBtn.disabled = !state;
  inputMessage.disabled = !state;
}

function createMessageElement(message) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  if (message.type === 'game') {
    if (!message.message) {
      return null;
    }
    messageDiv.classList.add('game-message');
    messageDiv.innerText = message.message;
  } else {
    const userIconDiv = document.createElement('div');
    userIconDiv.classList.add('user-icon');
    const userIconImg = document.createElement('img');
    userIconImg.src = message.userIcon;
    userIconDiv.appendChild(userIconImg);
    messageDiv.appendChild(userIconDiv);

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

    messageDiv.appendChild(userDetailsDiv);
  }

  return messageDiv;
}


function appendMessageElement(messageElement) {
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendMessage() {
  const messageStr = inputMessage.value.trim();
  if (messageStr) {
    const message = {
      type: 'player',
      message: messageStr,
      userIcon: 'person-icon.svg',
      userName: playerName,
    };
    processMessage(message)
    inputMessage.value = '';
    setButtonStates(false);
  }
}

inputMessage.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

setButtonStates(false);

function processMessage(message) {

  if (message.type === 'character') {
    message.userIcon = 'person-icon.svg';
    message.userName = message.character;
  }
  else if (message.type === 'game') {
    //parse triggers
  }

  messages.push(message);
  console.log(message)

  if (message.type != 'system'){
    const messageElement = createMessageElement(message);
    if (messageElement){
      appendMessageElement(messageElement);
    }
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isLatestMessagePlayer() {
  return messages.length > 0 && messages[messages.length - 1].type === 'player';
}

function removeLatestMessage() {
  messages.pop();
  chatWindow.removeChild(chatWindow.lastChild);
}


async function runGameIntro() {

    const plannedMessages = [
      { type: 'system', message: PROMPT },
      { type: 'game', triggers: { current_location: 'Occidarian Capital City Bound Ship', current_characters: [ 'Shipmate', 'Bard' ] } },
      { type: 'character', character: 'Shipmate', message: 'Ahoy, traveler! We\'ll be docking at the capital soon. Better get ready for a sight to behold!' },
      { type: 'character', character: 'Bard', message: 'Oh, gather \'round, and lend an ear, to a tale that tickles the heart,\nOf a boy-emperor, so young and small, who\'s trying to play his part.\nHe sits upon a gilded throne, in robes much too large to wear,\nAnd though he\'s not quite tall enough, he rules with a clumsy air.\n\nHis head is filled with lofty thoughts, philosophy, and prose,\nHe ponders life and quotes from scrolls, in garments that his father chose.\nHe\'d rather read a dusty tome, than wield a scepter\'s might,\nBut in the art of governance, he fumbles day and night!' },
      { type: 'character', character: 'Shipmate', message: 'Oh will you shut your trap Eldric!' },
      { type: 'game', triggers: { character: 'Bard', name: 'Eldric the bard' } },
      { type: 'character', character: 'Eldric the bard', message: 'So let us toast to our dear land, where folly takes the stage,\nAnd hope that in the years to come, we\'ll turn a wiser page.\nFor now, we\'ll grin and bear the jest, our empire\'s strange parade,\nAnd sing the tale of Puer Cif\'rus, the emperor unmade!' },
      { type: 'game', message: 'The ship pulls into Occidarian Capital City’s Eastern Port', triggers: { current_location: 'Occidarian Capital City, Eastern Port', current_characters: [ 'Shipmate', 'Eldric the bard', 'Occidarian Guard' ] } },
      { type: 'character', character: 'Eldric the bard', message: 'Fellow traveler, what should people call you around these parts?' }
    ]
    
    const plannedMessages2 =[
      { type: 'character', character: 'Occidarian Guard', message: 'Attention passengers! This ship and its contents are hereby seized under suspicion of smuggling! You are to disembark and submit to inspection immediately!' },
      { type: 'character', character: 'Eldric the bard', message: 'Oh dear! A smugglers life for me? Who would have guessed? And here I thought we were just carrying potatoes and turnips!' },
      { type: 'character', character: 'Occidarian Guard', message: 'You there! You seem to know this... bard. You are coming with us!' },
      { type: 'game', message: 'You are dragged to the Occidarian Capital City Prison', triggers: { current_location: 'Occidarian Capital City Prison', current_characters: [ 'Eldric the bard', 'Occidarian Guard' ] } }
    ]
    

    for (const plannedMessage of plannedMessages) {
      await delay(1000);
      processMessage(plannedMessage);
    }
    setButtonStates(true);
    while (!isLatestMessagePlayer()) {
      await delay(1000);
    }
    const playerMessage = messages[messages.length - 1];
    const newplayerName = (await getPlayerName(playerMessage));
    if (newplayerName){
      playerName = newplayerName
    }
  
    for (const plannedMessage of plannedMessages2) {
      await delay(1000);
      processMessage(plannedMessage);
    }

    while (true){
      let message = await executeOnLLM(messages)
      if (message) {
        processMessage(message);
      }
      else {
        removeLatestMessage();
      }
      setButtonStates(true);
      while (!isLatestMessagePlayer()){
        await delay(1000);
      }
    }
  }

runGameIntro();
