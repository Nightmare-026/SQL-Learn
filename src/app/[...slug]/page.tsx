'use client';
// Catch-all safety net for the hash-router app.
//
// The whole app routes client-side via window.location.hash (`/#/module/5`,
// `/#/projects`, ...). The Next.js server only ever serves `/`. If a hash-less
// path slips through — a shared/copied link, a proxy or CDN that rewrites the
// URL, a search-engine entry, or a user typing the path by hand — the server
// would otherwise answer with a dead 404 page with no navigation back.
//
// This catch-all rewrites the URL in the browser itself (deterministic, immune
// to server-side fragment-stripping quirks of next/navigation redirect()):
//   /module/5        ->  /#/module/5
//   /projects/sql-1  ->  /#/projects/sql-1
//   /anything/else   ->  /#/anything/else  (client router falls back to landing)
//
// location.replace() is used so the broken path-URL does not linger in the
// browser's back-button history.
import { useEffect } from 'react';

export default function HashRedirect() {
  useEffect(() => {
    const path = window.location.pathname + window.location.search;
    window.location.replace(window.location.origin + '/#' + path);
  }, []);
  return null;
}
