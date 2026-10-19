// Loaded on account and template pages by core.js.
(function () {
  var config = window.PYD_SUPABASE_CONFIG;
  if (!config || !config.url || !config.anonKey) {
    window.pydSupabase = null;
    return;
  }
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    window.PYD_SUPABASE_ERROR = new Error("Supabase SDK did not load.");
    return;
  }
  window.pydSupabase = window.supabase.createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
})();
