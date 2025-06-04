jest.mock('./supabaseClient', () => ({
  supabase: {
    from: jest.fn(),
    auth: jest.fn(),
    storage: jest.fn(),
  }
}));

const { supabase } = require('./supabaseClient');

test('Supabase client initializes correctly', () => {
  expect(supabase).toBeDefined();
  expect(typeof supabase.from).toBe('function');
});
