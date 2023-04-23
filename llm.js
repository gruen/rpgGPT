const OPENAI_API_KEY = '';
console.error('Need to update OPENAI_API_KEY')

function fixMissingBrace(str) {
  if (!str.includes('{')) {
    str = '{' + str;
  }

  if (!str.includes('}')) {
    str += '}';
  }

  return str;
}

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

async function executeOnLLM(messages) {
  const llmMessages = messages.map(convertToLLMMessage);
  return await _executeOnLLM(llmMessages);
}

async function _executeOnLLM(llmMessages, retries = 3) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: llmMessages,
      temperature: 0.7,
    }),
  });

  if (response.status !== 200) {
    console.error('API request error:', (await response.json()).error);
    return null;
  }

  const content = fixMissingBrace((await response.json()).choices[0].message.content.trim());

  if (isValidJSON(content)) {
    return JSON.parse(content);
  }

  console.error('Invalid JSON:', content);

  if (retries > 0) {
    return _executeOnLLM(llmMessages, retries - 1);
  }

  console.error('Max retries reached');
  return null;
}


async function getPlayerName(playerMessage) {
  const messages = [
    { role: 'system', content: `Return a player's name in JSON format: { "player_name": "Example Name" }. Always return JSON. If the player does not give you a name respond with { "player_name": "Mysterious Traveler" }.` },
    { role: 'user', content: 'My name is John Everyman' },
    { role: 'assistant', content: '{ "player_name": "John Everyman" }' },
    { role: 'user', content: 'My name is none of your business' },
    { role: 'assistant', content: '{ "player_name": "Mysterious Traveler" }' },
    { role: 'user', content: 'None of your fucking business' },
    { role: 'assistant', content: '{ "player_name": "Mysterious Traveler" }' },
    { role: 'user', content: 'Call me Zhao Huang' },
    { role: 'assistant', content: '{ "player_name": "Zhao Huang" }' },
    convertToLLMMessage(playerMessage),
  ];
  const data = await _executeOnLLM(messages)
  if (data){
    return data["player_name"];
  }

}

function convertToLLMMessage(message) {
  let llmMessage = {};

  if (message.type === 'player') {
    llmMessage = {
      role: 'user',
      content: message.message
    };
  } else if (message.type === 'game') {
    llmMessage = {
      role: 'assistant',
      content: JSON.stringify({
        type: message.type,
        message: message.message,
        triggers: message.triggers
      })
    };
  } else if (message.type === 'character') {
    llmMessage = {
      role: 'assistant',
      content: JSON.stringify({
        type: message.type,
        character: message.character,
        message: message.message
      })
    };
  } else if (message.type === 'system') {
    llmMessage = {
      role: 'system',
      content: JSON.stringify({
        type: message.type,
        message: message.message
      })
    };
  }

  return llmMessage;
}

