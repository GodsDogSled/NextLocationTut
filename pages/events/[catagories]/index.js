import Image from "next/image";
import Link from "next/link";

const EventsCatagoryPage = ({ data, pageName }) => {

  return (
    <div>
      <h1>Events in {pageName}</h1>
      {console.log(data)}
      {data.map(ev =>
        <Link key={ev.id} href={`/events/${ev.city}/${ev.id}`} >
          <Image width={300} height={300} alt={ev.title} src={ev.image} />
          <h2>{ev.title}</h2>
          <p>{ev.description}</p>
        </Link>
      )}
    </div>
  )
}

export default EventsCatagoryPage;

export async function getStaticPaths() {
  const { events_categories } = await import("../../../data/data.json")


  const allPaths = events_categories.map(ev => {
    return {
      params: {
        catagories: ev.id.toString(),
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
  const id = context?.params.catagories;

  const data = allEvents.filter(ev => ev.city === id);
  console.log(data)

  return {
    props: { data, pageName: id }
  }
}
