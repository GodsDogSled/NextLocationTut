import path from 'path';
import fs from 'fs';

function buildPath() {
  return path.join(process.cwd(), 'data', 'data.json')
}

function extractData(filePath) {
  const jsonData = fs.readFileSync(filePath);
  return JSON.parse(jsonData);
}

export default function handler(req, res) {
  const { method } = req;
  const filePath = buildPath();
  const { events_categories, allEvents } = extractData(filePath);

  if (!allEvents) {
    return res.status(404).json({
      message: 'Events data not found'
    })
  }

  if (method === "POST") {
    const { email, eventId } = req.body;

    if (!email | !email.include('@')) {
      res.status(422).json({ messgae: 'invalid email adress' })
    }

    const newAllEvents = allEvents.map(ev => {
      if (ev.id === eventId) {
        if (ev.emails_registered.includes(email)) {
          res.status(401).json({ message: 'this email already exists in the registration' })
          return ev;
        }
        return {
          ...ev, emails_registered: [...ev.emails_registered, email]
        }
      }
      return ev;
    })

    fs.writeFileSync(filePath, JSON.stringify({ events_categories, allEvents: newAllEvents }))

    res.status(200).json({ message: `You have been registerd successfully with email:${email} ${eventId}` })
  }


}