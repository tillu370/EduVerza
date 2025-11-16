# Supabase Setup Guide

## Step 1: Create Resources Table

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `supabase-migration.sql` file
6. Click **Run** to execute the SQL

## Step 2: Verify Table Creation

1. Go to **Table Editor** (left sidebar)
2. You should see the `resources` table
3. Check that all columns are created correctly

## Step 3: Test the Connection

The table is now ready! The application will automatically:
- Fetch resources from Supabase
- Allow public read access
- Require authentication for insert/update/delete operations

## Table Structure

The `resources` table includes:
- `id` - UUID primary key
- `title` - Resource title
- `subject` - Subject name
- `department` - Department name
- `year` - Year (1-4)
- `type` - Resource type (Notes, Previous Papers, Records, Observations)
- `views` - View count
- `downloads` - Download count
- `file_size` - File size (optional)
- `description` - Description (optional)
- `file_url` - File URL for download (optional)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Row Level Security (RLS)

- **Public Read**: Anyone can view resources
- **Authenticated Write**: Only authenticated users can add/edit/delete resources

## Next Steps

1. Update your components to use Supabase hooks instead of mock data
2. Set up file storage in Supabase Storage for actual file uploads
3. Configure authentication if you want user-specific features

