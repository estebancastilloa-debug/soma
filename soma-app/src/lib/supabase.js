import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://xngpgbdfybyhrthxqgwg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZ3BnYmRmeWJ5aHJ0aHhxZ3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NDI2MDgsImV4cCI6MjA5NDUxODYwOH0.RsL1O4vH69NYRtkRweNUgyw-ascj_zdNjFDigJhPExw'
);
