// supabaseClient.js

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase with your API URL and anon/public key
const supabaseUrl = 'https://mbksagkianpegvnswmha.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ia3NhZ2tpYW5wZWd2bnN3bWhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE0OTgwNzEsImV4cCI6MjA0NzA3NDA3MX0.TvG_wd4V8DVsuaIcJqMn9xPheL85safy7zLGQxU5yVY'; // Replace with your Supabase anon/public key

// Create the client instance
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
