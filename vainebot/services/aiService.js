const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://19.99.99.200:11434';

/**
 * Envoie un prompt à Ollama avec historique de conversation optionnel
 * @param {Array<{role: string, content: string}>} messages
 * @param {boolean} isComplex - Bascule sur le modèle 7B si true
 */
async function askVainy(messages, isComplex = false) {
  const model = isComplex 
    ? (process.env.COMPLEX_AI_MODEL || 'qwen2.5:7b') 
    : (process.env.DEFAULT_AI_MODEL || 'llama3.2:3b');

  const payload = {
    model: model,
    messages: [
      {
        role: 'system',
        content: 'Tu es Vainy, un assistant personnel intelligent, concis et efficace. Réponds toujours en français.'
      },
      ...messages
    ],
    stream: false
  };

  const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Erreur Ollama (${response.status}): ${response.statusText}`);
  }

  const data = await response.json();
  return data.message.content;
}

module.exports = { askVainy };

