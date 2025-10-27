const { createClient } = require('@supabase/supabase-js');

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  const errorMessage = 'Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.';
  console.error('ERROR:', errorMessage);
  
  // On Vercel, don't exit - just throw on first use
  if (process.env.VERCEL) {
    throw new Error(errorMessage);
  } else {
    process.exit(1);
  }
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

/**
 * Database operations for registrations
 */
const db = {
  /**
   * Get total count of registrations
   */
  async getTotalCount() {
    const { count, error } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return count || 0;
  },

  /**
   * Find registration by Ethereum address
   */
  async findByAddress(address) {
    const { data, error } = await supabase
      .from('registrations')
      .select('address, validator_key, signature')
      .eq('address', address)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      throw error;
    }
    
    return data || null;
  },

  /**
   * Find registration by validator key (case-insensitive)
   */
  async findByValidatorKey(validatorKey) {
    const { data, error } = await supabase
      .from('registrations')
      .select('address, validator_key')
      .ilike('validator_key', validatorKey)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    
    return data || null;
  },

  /**
   * Insert new registration
   */
  async insertRegistration(address, validatorKey, signature) {
    const { data, error } = await supabase
      .from('registrations')
      .insert([{
        address,
        validator_key: validatorKey,
        signature
      }])
      .select()
      .single();
    
    if (error) {
      // Handle unique constraint violations
      if (error.code === '23505') { // PostgreSQL unique violation
        const constraintError = new Error('Duplicate registration detected.');
        constraintError.code = 'UNIQUE_VIOLATION';
        throw constraintError;
      }
      throw error;
    }
    
    return data;
  }
};

module.exports = { supabase, db };
