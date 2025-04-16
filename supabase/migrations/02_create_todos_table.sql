-- Create a table for todos
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  task TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  inserted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create a trigger for setting updated_at on update
CREATE OR REPLACE FUNCTION update_todos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_todos_updated_at
BEFORE UPDATE ON todos
FOR EACH ROW
EXECUTE FUNCTION update_todos_updated_at();

-- Create policies for secure access
-- Allow users to view their own todos
CREATE POLICY "Users can view their own todos." 
  ON todos FOR SELECT 
  USING (auth.uid() = user_id);

-- Allow users to create their own todos
CREATE POLICY "Users can create their own todos." 
  ON todos FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own todos
CREATE POLICY "Users can update their own todos." 
  ON todos FOR UPDATE 
  USING (auth.uid() = user_id);

-- Allow users to delete their own todos
CREATE POLICY "Users can delete their own todos." 
  ON todos FOR DELETE 
  USING (auth.uid() = user_id); 