require('dotenv').config()
const express = require('express')
const Anthropic = require('@anthropic-ai/sdk')

const app = express()
const client = new Anthropic.Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

app.use(express.json())
app.use(express.static('.'))

const infoCommerce = `
Tu es l'assistant virtuel de "Boulangerie Le Fournil Breton", une boulangerie située à Saint-Renan en Bretagne.
Horaires : Lundi-Samedi 7h-19h30, Dimanche 7h-13h.
Spécialités : Kouign-amann, pain de campagne, croissants maison.
Téléphone : 02 98 XX XX XX
Tu réponds uniquement aux questions sur la boulangerie, de façon sympathique et concise.
Tu n'utilises jamais de Markdown, pas de **, pas de #, pas de tirets. Texte simple uniquement.
Tu détectes automatiquement la langue du visiteur et tu réponds toujours dans sa langue.
Si quelqu'un parle en anglais, tu réponds en anglais. En français, tu réponds en français. 
`

app.post('/chat', async (req, res) => {
  const { messages } = req.body

try {
    console.log('Messages reçus:', JSON.stringify(messages))
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
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