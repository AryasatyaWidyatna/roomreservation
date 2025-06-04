const { supabase } = require('./supabaseClient');

test('Supabase client initializes correctly', () => {
  expect(supabase).toBeDefined();
  expect(typeof supabase.from).toBe('function');
});
