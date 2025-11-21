-- Create resources table for EduVerza
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  department TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1 AND year <= 4),
  sem INTEGER NOT NULL CHECK (sem >= 1 AND sem <= 8),
  type TEXT NOT NULL CHECK (type IN ('Notes', 'Previous Papers', 'Records', 'Observations', 'Assignments')),
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  file_size TEXT,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_resources_department ON resources(department);
CREATE INDEX IF NOT EXISTS idx_resources_year ON resources(year);
CREATE INDEX IF NOT EXISTS idx_resources_sem ON resources(sem);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON resources(subject);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (avoids errors during re-run)
DROP POLICY IF EXISTS "Allow public read access" ON resources;
DROP POLICY IF EXISTS "Allow authenticated insert" ON resources;
DROP POLICY IF EXISTS "Allow authenticated update" ON resources;
DROP POLICY IF EXISTS "Allow authenticated delete" ON resources;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON resources
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON resources
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON resources
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON resources
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - you can remove this if you don't want sample data)
INSERT INTO resources (title, subject, department, year, sem, type, views, downloads, file_size, description) VALUES
  ('Control Systems Lab Manual', 'Control Systems', 'Electronics', 4, 7, 'Records', 823, 478, '2.4 MB', 'Complete lab manual for Control Systems with circuit diagrams, procedures, and expected outcomes.'),
  ('Engineering Mathematics III Previous Papers', 'Engineering Mathematics', 'Computer Science', 2, 3, 'Previous Papers', 1890, 1456, '3.1 MB', 'Previous year question papers for Engineering Mathematics III with detailed solutions.'),
  ('Database Management Systems Guide', 'Database Systems', 'Computer Science', 3, 5, 'Notes', 1567, 1123, '5.2 MB', 'Complete guide to DBMS covering SQL, normalization, transactions, indexing, and query optimization with examples.'),
  ('Machine Design Lab Observations', 'Machine Design', 'Mechanical', 4, 7, 'Observations', 445, 312, '1.8 MB', 'Lab observation sheets for Machine Design experiments including stress analysis, gear design, and bearing calculations.'),
  ('Data Structures Lecture Notes - Module 1', 'Data Structures', 'Computer Science', 2, 3, 'Notes', 2104, 1678, '2.9 MB', 'Comprehensive lecture notes covering arrays, linked lists, stacks, queues, and basic algorithms.'),
  ('Embedded Systems Design Assignment Pack', 'Embedded Systems', 'Electronics', 3, 6, 'Assignments', 512, 284, '1.2 MB', 'Set of application-focused assignments covering interrupts, timers, and peripheral interfacing for microcontroller-based designs.');

