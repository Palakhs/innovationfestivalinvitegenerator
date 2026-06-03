import { NextResponse } from 'next/server'

export async function POST(request) {
  const { name, company, title, sender, context, warmth, channel, registration } = await request.json()

  if (!name || !company) {
    return NextResponse.json({ error: 'Name and company are required.' }, { status: 400 })
  }

  const warmthMap = {
    hot:  'hot — active deal or renewal in progress, very close relationship, speaks regularly',
    warm: 'warm — spoken in the last few months, knows Copperleaf, relationship is active',
    cold: 'cold — relationship has gone quiet, or this is a prospect they have not spoken to recently'
  }

  const registrationContext = registration === 'registered'
    ? 'The contact is already registered for the Northumbrian Water Innovation Festival. Do NOT invite them to the festival itself. The only goal is to invite them into the IFS Copperleaf sprint specifically. Do not include the registration link.'
    : 'It is unknown whether the contact is registered for the festival. The message should invite them to both the festival and the IFS Copperleaf sprint. Include the registration link: innovationfestival.org/register — registration closes 28 June.'

  const channelInstruction = channel === 'linkedin'
    ? 'Write a LinkedIn DM only. Max 5 lines. Casual, direct, conversational. End with a simple question or clear next step. Label it LINKEDIN:'
    : 'Write an email only. Include a subject line first (label it Subject:). Body should be short — no more than 6 sentences. Direct and human. Label the full thing EMAIL:'

  const prompt = `You are writing a ${channel === 'linkedin' ? 'LinkedIn DM' : 'short email'} for a sales person at IFS Copperleaf.

RULES — follow these strictly:
- Human, direct, non-marketing voice
- Short sentences
- No exclamation marks
- No em dashes
- No buzzwords or filler phrases like "I hope this finds you well" or "I wanted to reach out"
- Do not use the phrase "Northumbrian Water Innovation Festival" more than once
- Sound like a real salesperson not a press release
- CRITICALLY IMPORTANT: You must use the context provided to personalise the message. Reference specific details from the context — the person's challenges, their situation, their company's circumstances. A message that ignores the context is a failure.
- The warmth level should change the tone AND the opening line significantly. Hot = direct and assumptive, referencing the active relationship. Warm = friendly, references prior contact. Cold = more careful, acknowledges gap or introduces briefly.
- Registration status must change the message structure: if registered, go straight to the sprint. If not sure, invite to festival first then sprint.

Contact:
- Name: ${name}
- Company: ${company}
- Title: ${title || 'not specified'}
- Context about this person and their situation: ${context || 'no additional context provided — write a general message'}
- Relationship warmth: ${warmthMap[warmth] || warmthMap.warm}
- Sender name: ${sender || 'the sales person'}

Registration status: ${registrationContext}

Sprint description — use this and only this:
IFS Copperleaf is running a sprint at the festival exploring how AI can gather expert knowledge, cross-reference it against maintenance history and produce a quantified risk-over-time profile for asset classes that lack traditional deterioration models. Live session across the week, proof of concept on a real asset class.

Festival context — pick ONE angle maximum, do not list all:
- Ofwat will be there running their own sprint
- Water teams from across the sector will be attending
- Good week to work on a real problem with peers in the room
- Newcastle Racecourse, 6 to 9 July

${channelInstruction}

Then on a new line write:
TIP: [one sentence of practical send advice specific to this person and their context]`

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
    })
  })

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

  if (!text) {
    return NextResponse.json({ error: 'No response from AI. Please try again.' }, { status: 500 })
  }

  const tipMatch = text.match(/TIP:\s*([\s\S]*?)$/)
  const tip = tipMatch ? tipMatch[1].trim() : ''
  const mainContent = text.replace(/TIP:[\s\S]*$/, '').trim()

  if (channel === 'linkedin') {
    const liMatch = mainContent.match(/LINKEDIN:\s*([\s\S]*?)$/)
    if (!liMatch) return NextResponse.json({ error: 'Failed to parse response. Please try again.' }, { status: 500 })
    return NextResponse.json({ channel: 'linkedin', message: liMatch[1].trim(), tip })
  } else {
    const subjectMatch = mainContent.match(/Subject:\s*([^\n]+)/)
    const bodyMatch = mainContent.match(/Subject:[^\n]+\n([\s\S]*)/)
    if (!subjectMatch) return NextResponse.json({ error: 'Failed to parse response. Please try again.' }, { status: 500 })
    return NextResponse.json({
      channel: 'email',
      emailSubject: subjectMatch[1].trim(),
      emailBody: bodyMatch ? bodyMatch[1].trim() : mainContent,
      tip
    })
  }
}
