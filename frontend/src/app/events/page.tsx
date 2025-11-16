'use client';

import { Suspense, useEffect, useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchEvents, Event, searchEvents, ElasticsearchHit } from '@/lib/api';
import Image from 'next/image';

function EventsPageContent() {
  const searchParams = useSearchParams();
  const localeFromUrl = searchParams.get('locale') || 'en';
  
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResultsCount, setSearchResultsCount] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load all events
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEvents({ locale: localeFromUrl });
        setAllEvents(data);
        setEvents(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
        setError(errorMessage);
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      loadEvents();
    }
  }, [localeFromUrl, mounted]);

  // Handle search
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      // If search is empty, show all events
      setEvents(allEvents);
      setSearchResultsCount(null);
      setSearching(false);
      return;
    }

    try {
      setSearching(true);
      setError(null);
      
      // Search using Elasticsearch
      const searchResults = await searchEvents(query, localeFromUrl);
      
      // Get total count - handle both number and object format
      const total = typeof searchResults.hits.total === 'number' 
        ? searchResults.hits.total 
        : (searchResults.hits.total as { value: number; relation?: string })?.value || 0;
      setSearchResultsCount(total);
    
      // Get event hits from search results
      const eventHits = searchResults.hits.hits.filter(
        (hit: ElasticsearchHit) => hit._source.contentType === 'api::event.event'
      );
      if (eventHits.length === 0) {
        setEvents([]);
        setSearching(false);
        return;
      }

      // Get event documentIds from search results
      const eventDocumentIds = eventHits.map((hit: ElasticsearchHit) => hit._source.documentId);
      
      // Try to match with already loaded events first
      const matchedEvents = allEvents.filter((event: Event) => 
        eventDocumentIds.includes(event.documentId)
      );

      console.log(allEvents, matchedEvents, eventHits, eventDocumentIds);
      // If we have matches, use them
      if (matchedEvents.length > 0) {
        // Sort by relevance (maintain order from search results)
        const sortedEvents = eventDocumentIds
          .map((documentId: string) => matchedEvents.find((e: Event) => e.documentId === documentId))
          .filter((e: Event | undefined) => e !== undefined) as Event[];
        setEvents(sortedEvents);
        setSearching(false);
        return;
      }

      // If no matches in loaded events, fetch full details for each event
      const fetchedEvents: Event[] = [];
      for (const hit of eventHits) {
        try {
          const baseUrl = typeof window !== 'undefined' 
            ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337/api')
            : 'http://localhost:1337/api';
          const eventUrl = `${baseUrl}/events/${hit._source.slug}?locale=${localeFromUrl}`;
          const response = await fetch(eventUrl);
          if (response.ok) {
            const eventData = await response.json();
            const event = Array.isArray(eventData) 
              ? eventData[0] 
              : (eventData.data || eventData);
            if (event) fetchedEvents.push(event);
          }
        } catch (fetchErr) {
          console.error(`Error fetching event ${hit._source.id}:`, fetchErr);
          // If fetch fails, create a minimal event from _source data
          const minimalEvent: Event = {
            id: hit._source.id,
            documentId: hit._id,
            title: hit._source.title,
            slug: hit._source.slug,
            locale: hit._source.locale,
            startAt: '',
            endAt: '',
            allDay: false,
          };
          fetchedEvents.push(minimalEvent);
        }
      }
      
      if (fetchedEvents.length > 0) {
        // Sort by relevance (maintain order from search results)
        const sortedEvents = eventDocumentIds
          .map((documentId: string) => fetchedEvents.find((e: Event) => e.documentId === documentId))
          .filter((e: Event | undefined) => e !== undefined) as Event[];
        setEvents(sortedEvents);
      } else {
        // Fallback: create minimal events from _source data
        const minimalEvents: Event[] = eventHits.map((hit: ElasticsearchHit) => ({
          id: hit._source.id,
          documentId: hit._id,
          title: hit._source.title,
          slug: hit._source.slug,
          locale: hit._source.locale,
          startAt: '',
          endAt: '',
          allDay: false,
        }));
        setEvents(minimalEvents);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search events';
      setError(errorMessage);
      console.error('Error searching events:', err);
      // Fallback to showing all events on search error
      setEvents(allEvents);
    } finally {
      setSearching(false);
    }
  }, [localeFromUrl, allEvents]);

  // Debounced search
  useEffect(() => {
    if (!mounted) return;

    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch, mounted]);

  const formatDate = (dateString: string) => {
    if (!mounted) return '';
    const date = new Date(dateString);
    const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
    return date.toLocaleDateString(localeFromUrl === 'ur' ? 'ur-PK' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...(hasTime && {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  const formatTime = (dateString: string) => {
    if (!mounted) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString(localeFromUrl === 'ur' ? 'ur-PK' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const now = useMemo(() => (mounted ? new Date() : null), [mounted]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold text-red-600 dark:text-red-400">Error</div>
          <div className="text-zinc-600 dark:text-zinc-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 sm:text-5xl">
            {localeFromUrl === 'ur' ? 'تقریبات' : 'Events'}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            {localeFromUrl === 'ur' 
              ? 'تمام تقریبات دیکھیں' 
              : 'View all upcoming and past events'}
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative mx-auto max-w-2xl">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={localeFromUrl === 'ur' ? 'تقریبات تلاش کریں...' : 'Search events...'}
              className="block w-full pl-10 pr-3 py-3 border border-zinc-300 rounded-lg bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-50 dark:placeholder-zinc-500"
            />
            {searching && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-600 dark:border-zinc-400"></div>
              </div>
            )}
          </div>
          {searchResultsCount !== null && searchQuery.trim() && (
            <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
              {localeFromUrl === 'ur' 
                ? `${searchResultsCount} نتائج ملے` 
                : `Found ${searchResultsCount} result${searchResultsCount !== 1 ? 's' : ''}`}
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
              {localeFromUrl === 'ur' ? 'لوڈ ہو رہا ہے...' : 'Loading events...'}
            </div>
          </div>
        ) : searching ? (
          <div className="text-center py-12">
            <div className="mb-4 text-lg text-zinc-600 dark:text-zinc-400">
              {localeFromUrl === 'ur' ? 'تلاش کر رہے ہیں...' : 'Searching...'}
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {searchQuery.trim()
                ? (localeFromUrl === 'ur' 
                    ? 'کوئی تقریب نہیں ملی' 
                    : 'No events found')
                : (localeFromUrl === 'ur' 
                    ? 'کوئی تقریب نہیں ملی' 
                    : 'No events found')}
            </p>
            {searchQuery.trim() && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setEvents(allEvents);
                  setSearchResultsCount(null);
                }}
                className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 underline"
              >
                {localeFromUrl === 'ur' ? 'تمام تقریبات دیکھیں' : 'Show all events'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const hasDates = event.startAt && event.endAt;
              const startDate = hasDates ? new Date(event.startAt) : null;
              const endDate = hasDates ? new Date(event.endAt) : null;
              const isPast = now && endDate ? endDate < now : false;
              
              return (
                <div
                  key={event.id || event.documentId}
                  className="group overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg dark:bg-zinc-900"
                >
                  {event.cover?.url && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={
                          event.cover.url.startsWith('http') 
                            ? event.cover.url 
                            : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:1337'}${event.cover.url}`
                        }
                        alt={event.cover.alternativeText || event.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={event.cover.url.includes('localhost')}
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    {hasDates && (
                      <div className="mb-2 flex items-center gap-2">
                        {isPast ? (
                          <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                            {localeFromUrl === 'ur' ? 'گذشتہ' : 'Past'}
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            {localeFromUrl === 'ur' ? 'آئندہ' : 'Upcoming'}
                          </span>
                        )}
                      </div>
                    )}
                    
                    <h2 className="mb-2 text-xl font-semibold text-black dark:text-zinc-50">
                      {event.title}
                    </h2>
                    
                    <div className="mb-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {hasDates && (
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span>
                            {formatDate(event.startAt)}
                            {!event.allDay && ` at ${formatTime(event.startAt)}`}
                          </span>
                        </div>
                      )}
                      
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    {event.description && (
                      <div
                        className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3"
                        dangerouslySetInnerHTML={{
                          __html: typeof event.description === 'string' 
                            ? event.description 
                            : JSON.stringify(event.description)
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EventsPageContent />
    </Suspense>
  );
}

