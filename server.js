require('dotenv').config()
const express = require('express')
const Anthropic = require('@anthropic-ai/sdk')
const config = require('./config.json')

const app = express()
const client = new Anthropic.Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

app.use(express.json())
app.use(express.static('.'))

const infoCommerce = `
Tu es l'assistant virtuel de "${config.nom}", un(e) ${config.type_activite} situé(e) à ${config.ville}.
Horaires : ${config.horaires}.
Spécialités : ${config.specialites}.
Téléphone : ${config.telephone}.
Tu réponds uniquement aux questions sur ce commerce, de façon sympathique et concise.
Tu n'utilises jamais de Markdown, pas de **, pas de #, pas de tirets. Texte simple uniquement.
Tu détectes automatiquement la langue du visiteur et tu réponds toujours dans sa langue.
`

app.get('/config', (req, res) => {
  res.json(config)
})

app.post('/chat', async (req, res) => {
  const { messages } = req.body

  try {
    console.log('Messages reçus:', JSON.stringify(messages))
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: infoCommerce,
      messages: messages
    })
    res.json({ reply: response.content[0].text })
  } catch (error) {
    console.error('Erreur API:', error.message)
    res.status(500).json({ reply: 'Erreur serveur' })
  }
})

app.listen(3000, () => {
  console.log('Serveur démarré sur http://localhost:3000')
})