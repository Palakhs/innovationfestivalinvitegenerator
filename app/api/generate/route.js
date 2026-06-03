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
    : 'It is unknown whether the contact is registered for the festival. The message should invite them to both the festival and the IFS Copperleaf sprint. Include the registration link: innovationfestival.org/register and mention registration closes 28 June.'

  const channelInstruction = channel === 'linkedin'
    ? 'Write a LinkedIn DM only. Max 5 lines. Casual, direct, conversational. End with a simple question or clear next step. Label it LINKEDIN:'
    : 'Write an email only. Include a subject line first (label it Subject:). Body should be short, no more than 6 sentences. Direct and human. Label the full thing EMAIL:'

  const prompt = `You are writing a ${channel === 'linkedin' ? 'LinkedIn DM' : 'short email'} for a sales person at IFS Copperleaf.

RULES:
- Human, direct, non-marketing voice
- Short sentences
- No exclamation marks
- No em dashes
- No filler phrases like "I hope this finds you well" or "I wanted to reach out"
- Do not use the phrase "Northumbrian Water Innovation Festival" more than once
- MOST IMPORTANT: Use the context field below to personalise the message. Reference specific details from it. A generic message that ignores context is a failure.
- The warmth level must change both the opening line and overall tone significantly. Hot = direct and assumptive. Warm = friendly, references prior contact. Cold = careful, acknowledges gap.
- Registration status must change the structure:  registered skip festival invite,  unsure include it.

Contact:
- Name: ${name}
- Company: ${company}
- Title: ${title || 'not specified'}
- Context: ${context || 'none provided'}
- Warmth: ${warmthMap[warmth] || warmthMap.warm}
- Sender: ${sender || 'the sales person'}

Registration: ${registrationContext}

Sprint: IFS Copperleaf is running a sprint at the festival exploring how AI can gather expert knowledge, cross-reference it against maintenance history and produce a quantified risk-over-time profile for asset classes that lack traditional deterioration models. Live session, proof of concept on a real asset class.

Festival context (pick ONE angle only): Ofwat will be there, water teams from across the sector attending, Newcastle Racecourse 6 to 9 July.

${channelInstruction}

TIP: [one sentence of practical advice for sending this specific message]`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 800 }
        })
      }
    )

    const data = await res.json()

     (!res.ok) {
      const errMsg = data?.error?.message || `HTTP ${res.status}`
      return NextResponse.json({ error: `AI error: ${errMsg}` }, { status: 500 })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!text) {
      return NextResponse.json({ error: 'Empty response from AI. Please try again.' }, { status: 500 })
    }

    const tipMatch = text.match(/TIP:\s*([\s\S]*?)$/)
    const tip = tipMatch ? tipMatch[1].trim() : ''
    const mainContent = text.replace(/TIP:[\s\S]*$/, '').trim()
const tipMatch = text.match(/TIP:\s*([\s\S]*?)$/)
    const tip = tipMatch ? tipMatch[1].trim() : ''
    const mainContent = text.replace(/TIP:[\s\S]*$/, '').trim()
    if (channel === 'linkedin') {
      const liMatch = mainContent.match(/LINKEDIN:\s*([\s\S]*?)$/)
      const message = liMatch ? liMatch[1].trim() : mainContent.trim()
      return NextResponse.json({ channel: 'linkedin', message, tip })
    } else {
      const subjectMatch = mainContent.match(/Subject:\s*([^\n]+)/i)
      const bodyMatch = mainContent.match(/Subject:[^\n]+\n([\s\S]*)/i)
      const emailSubject = subjectMatch ? subjectMatch[1].trim() : 'Northumbrian Water Innovation Festival'
      const emailBody = bodyMatch ? bodyMatch[1].trim() : mainContent.trim()
      return NextResponse.json({ channel: 'email', emailSubject, emailBody, tip })
    }

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
  } catch (err) {
    return NextResponse.json({ error: `Request failed: ${err.message}` }, { status: 500 })
  }
}
