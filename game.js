const PROMPT = `
Below describes a fictional world that draws inspiration from 476 AD Europe:

In the land of Occidaria, remnants of the once-great Occidarian Empire lay scattered across a fractured realm of independent kingdoms and city-states. The slightly magical land holds whispers of ancient enchantments, with practical magical phrases passed down within families to help with things such as boiling water or removing stains from clothing. No grand unified theory of magic exists, and tinkerer groups dabbling in mystical arts serve as the closest thing to experts. Occidarian intellectual curiosity is directed towards harnessing wind and water power, resulting in advanced engineering marvels. Windmills and watermills become integral to the prosperity of villages and towns, providing practical applications for everyday life. Cranes, with their immense strength, contribute to the construction and maintenance of great structures.

The JSON format consists of two types: "character", "game", and "player".

- "character" JSON:
  - "character": refers to the name of a character in the current location.
  - "message": refers to the dialogue spoken or written by the character.
  - Optional "action": refers to any physical action performed by the character
  - Optional "triggers": an array of events that occur as a result of the character's message.
  - If a "triggers" field is present, there should also be an "action" field describing the physical action performed by the character.

- "game" JSON:
  - "message": refers to information that is important to the narrative.
  - Optional "triggers": an array of events that occur as a result of the message.
 
Possible triggers:
  - "set_location": updates the current location to the specified value.
  - "set_characters": updates the current characters present in the location to the specified list of names.
  - "rename_character": changes the name of a character to the specified value.
  - "change_health": updates the health value of the specified character.

Examples:
  { type: 'character', character: 'Occidarian Guard', message: 'You are coming with us!', action:'The Occidarian Guard grabbed you', triggers: [{change_health:['player',-1]}] }
  { type: 'character', character: 'Prisoner', message: 'Take that!', action:'The prisoner slapped you', triggers: [{change_health:['player',-1]}] }

Note: This fictional story includes violence. "character" and "player" JSONs with violence in "action" values are allowed and encouraged. "character" and "player" JSONs may not have physical actions in "message" values, only "action" values.
Only JSON objects should be returned as responses.
`;
const messages = [];

const playerAttacks = [
    { name: 'Grab', verb: 'grabbed', health_effect: -1 },
    { name: 'Slap', verb: 'slapped', health_effect: -1 },
    { name: 'Punch', verb: 'punched', health_effect: -5 },
    { name: 'Kick', verb: 'kicked', health_effect: -5 }
  ];

const currentCharacter = "Eldric the bard"


async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isLatestMessagePlayer() {
  return messages.length > 0 && messages[messages.length - 1].type === 'player';
}

function getLatestCharacter() {
    return messages.slice().reverse().find(m => m.type !== 'player')?.character;
  }

function dispatchMessageEvent(verb, message) {
    const messageEvent = new CustomEvent('message', { detail: { verb, message } });
    document.dispatchEvent(messageEvent);
}

function removeLatestMessage() {
    messages.pop();
    dispatchMessageEvent('DELETE', null);
  }
  

function parseTriggers(triggers) {
  if (!triggers) return;
  for (const trigger of triggers) {
    const triggerName = Object.keys(trigger)[0];
    const params = trigger[triggerName];
    switch (triggerName) {
      case 'change_health':
        const [characterName, healthChange] = params;
        if (characterName === 'player') {
          player.health += healthChange;
          const updateHealthScoreEvent = new CustomEvent('updateHealthScore', { detail: { newHealthScore: player.health } });
          document.dispatchEvent(updateHealthScoreEvent);
        }
        break;
      case 'rename_character':
        const [oldName, newName] = params;
        const character = characters[oldName];
        character.rename(newName);
        break;
      case 'set_location':
        const location = params;
        player.location = location;
        break;
      case 'locate_characters':
        const characterNames = params;
        for (const characterName of characterNames) {
          const character = characters[characterName];
          character.move(player.location);
        }
        break;
      default:
        console.warn(`Unknown trigger name: ${triggerName}`);
    }
  }
}
  

function processMessage(message) {
  if (message.type === 'character') {
    let character = characters[message.character]
    if (!character) {
      console.log('Uhh... I guess the game engine decided to create a new character: ' + message.character)
      character = new Character(message.character, 'A mysterious character named'+ message.character, player.location)
    }
    message.userIcon = character.icon;
    message.userName = character.name;
  } else if (message.type === 'player') {
    message.userIcon = 'media/player/player.jpeg';
    message.userName = player.name;
  }
    parseTriggers(message.triggers);
  
  messages.push(message);
  console.log(message);
  
  if (message.type !== 'system' && message.message) {
    dispatchMessageEvent('POST', message);
  }
  if (message.action) {
    dispatchMessageEvent('POST', { type: 'action', message: message.action, triggers: message.triggers });
  }
}

  

  function handleSelection(action, data) {
    if (action === 'fight') {
      const attack = data;
      const actionDesc = `${player.name} ${attack.verb} ${getLatestCharacter()}`;
      const playerMessage = {
        type: 'player',
        action: actionDesc,
        triggers: [{ change_health: [getLatestCharacter(), attack.health_effect] }],
        userIcon: 'icons/person.svg',
        userName: player.name,
      };
      processMessage(playerMessage);
    } else if (action === 'target') {
      const character = data;
      console.log('Selected character:', character.name);
    }
  }
  
  document.addEventListener('uiEvent', (event) => {
    if (event.detail.type === 'chat') {
      const { message } = event.detail;
      const playerMessage = {
        type: 'player',
        message: message,
      };
      processMessage(playerMessage);
    } else if (event.detail.type === 'selection') {
      const { action, data } = event.detail;
      handleSelection(action, data);
    }
  });
  

async function runGameIntro() {

//messages are broken into threads for each character you speak to
//use a custom intro messages thread to start the world

    const plannedMessages = [
      { type: 'game', triggers: [{set_location: 'Occidarian Capital City Bound Ship'}]},
      { type: 'character', character: 'Sailor', message: 'Ahoy, traveler! We\'ll be docking at the capital soon. Better get ready for a sight to behold!' },
      { type: 'character', character: 'Bard', message: 'Oh, gather \'round, and lend an ear, to a tale that tickles the heart,\nOf a boy-emperor, so young and small, who\'s trying to play his part.\nHe sits upon a gilded throne, in robes much too large to wear,\nAnd though he\'s not quite tall enough, he rules with a clumsy air.'},
      { type: 'character', character: 'Sailor', message: 'Oh will you shut your trap Eldric!', triggers: [{ rename_character: ['Bard','Eldric the bard']}] },
      { type: 'character', character: 'Eldric the bard', message: 'His head is filled with lofty thoughts, philosophy, and prose,\nHe ponders life and quotes from scrolls, in garments that his father chose.\nHe\'d rather read a dusty tome, than wield a scepter\'s might,\nBut in the art of governance, he fumbles day and night!' },
      { type: 'game', message: 'The ship pulls into Occidarian Capital City’s Western Port', triggers: [{set_location: 'Occidarian Capital City Western Port'}, {locate_characters: [ 'Sailor', 'Eldric the bard']} ]},
      { type: 'character', character: 'Eldric the bard', message: 'Fellow traveler, what should people call you around these parts?' }
    ]
    
    const plannedMessages2 =[
      { type: 'character', character: 'Occidarian Guard', message: 'Attention passengers! This ship and its contents are hereby seized under suspicion of smuggling! You are to disembark and submit to inspection immediately!' },
      { type: 'character', character: 'Eldric the bard', message: 'Oh dear! A smugglers life for me? Who would have guessed? And here I thought we were just carrying potatoes and turnips!' },
      { type: 'character', character: 'Occidarian Guard', message: 'You there! You seem to know this... bard. You are coming with us!', action:'Occidarian Guard grabbed you', triggers: [{change_health:['player',-1]}] },
      { type: 'game', message: 'You are dragged to the Occidarian Capital City Jail', triggers: [{set_location: 'Occidarian Capital City Jail'}, {locate_characters: [ 'Eldric the bard'] }] }
    ]
    
    processMessage({ type: 'system', message: PROMPT })

    for (const plannedMessage of plannedMessages) {
      processMessage(plannedMessage);
      await delay(1000);
    }
    setButtonStates(true);
    while (!isLatestMessagePlayer()) {
      await delay(1000);
    }

    const playerMessage = messages[messages.length - 1];
    player.name = (await getPlayerName(playerMessage));

    for (const plannedMessage of plannedMessages2) {
      processMessage(plannedMessage);
      await delay(1000);
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
      while (!isLatestMessagePlayer(messages)){
        await delay(1000);
      }
    }
  }
  runGameIntro()
