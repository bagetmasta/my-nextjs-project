import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import EventList from "../../components/events/event-list";
import ResultsTitle from "../../components/events/results-title";
import Button from "../../components/ui/button";
import ErrorAlert from "../../components/ui/error-alert";
import useSWR from "swr";

function FilteredEventsPage() {
  const [events, setEvents] = useState();
  const router = useRouter();

  const filterData = router.query.slug;

  const { data, error } = useSWR(
    "https://my-nextjs-project-6afac-default-rtdb.europe-west1.firebasedatabase.app/events.json",
    (url) => fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const events = [];

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }

      setEvents(events);
    }
  }, [data]);

  let pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta name="description" content={`A list of filtered events.`} />
    </Head>
  );

  if (!events) {
    return (
      <Fragment>
        {pageHeadData}
        <p className="center">Loading...</p>
      </Fragment>
    );
  }

  const [filteredYear, filteredMonth] = filterData;

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`All events for ${numMonth}/${numYear}`}
      />
    </Head>
  );

  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth > 12 ||
    numMonth < 1 ||
    error
  ) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show all events</Button>
        </div>
      </Fragment>
    );
  }

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show all events</Button>
        </div>
      </Fragment>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <Fragment>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  );
}

export default FilteredEventsPage;
