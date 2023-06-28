import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

const SingleEventPage = ({ data }) => {
  const inputEmail = useRef();
  const router = useRouter();

  const [message, setMessage] = useState('');


  const onSubmit = async (e) => {
    e.preventDefault();
    const emailValue = inputEmail.current.value;
    const eventId = router?.query.slug;

    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!emailValue.match(validRegex)) {
      setMessage('Not a vaild email adress');
    } else {
      setMessage("registered")
    }

    try {
      const response = await fetch('../../api/email-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: emailValue, eventId: eventId })
      })

      if (!response.ok) throw new Error(`Error: ${response.status}`)
      const data = await response.json();
      console.log('POST', data);

    } catch (e) {
      console.log("error", e)
    }


  }
  return (
    <>
      <h1>{data.title}</h1>
      <Image alt={data.title} src={data.image} height={200} width={300} />
      <p>{data.description}</p>
      <form onSubmit={onSubmit}>
        <label>Register for Event</label>
        <input ref={inputEmail} id="email" placeholder="Insert Email Here" /><button type="submit">Submit</button>
      </form>
      <p>{(message)}</p>

    </>
  )
}

export default SingleEventPage;

export async function getStaticPaths() {
  const { allEvents } = await import("../../../data/data.json")

  const allPaths = allEvents.map(ev => {
    return {
      params: {
        catagories: ev.city.toString(),
        slug: ev.id.toString(),
      }
    }
  })


  return {
    paths: allPaths,
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const { allEvents } = await import("../../../data/data.json");
  const id = context?.params.slug;
  const pageData = allEvents.find(ev => ev.id === id);

  return {
    props: { data: pageData }
  }
}