const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase connection test
console.log('🔌 Testing Supabase connection...');
console.log('Supabase URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('Supabase Key:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    console.log('Form submitted:', req.body);
    
    try {
        // If Supabase is configured, save to database
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            const { createContract } = await import('./services/supabaseService.js');
            const result = await createContract(req.body);
            
            if (result.success) {
                res.json({ 
                    success: true, 
                    message: 'Contract saved to database successfully!',
                    data: result.data 
                });
            } else {
                res.json({ 
                    success: false, 
                    message: 'Error saving to database: ' + result.error,
                    data: req.body 
                });
            }
        } else {
            // Fallback to console logging if Supabase not configured
            res.json({ 
                success: true, 
                message: 'Form submitted successfully! (Database not configured)',
                data: req.body 
            });
        }
    } catch (error) {
        console.error('Error processing form:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error processing form',
            error: error.message 
        });
    }
});

// Handle template creation
app.post('/api/templates', async (req, res) => {
    try {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            const { templateService } = await import('./services/supabaseService.js');
            const result = await templateService.createTemplate(req.body);
            
            if (result.success) {
                res.json({ 
                    success: true, 
                    message: 'Template created successfully!',
                    data: result.data 
                });
            } else {
                res.json({ 
                    success: false, 
                    message: 'Error creating template: ' + result.error
                });
            }
        } else {
            res.json({ 
                success: false, 
                message: 'Database not configured'
            });
        }
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error creating template',
            error: error.message 
        });
    }
});

// Handle user fetching for agent dropdown
app.get('/api/users', async (req, res) => {
    try {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            const { userService } = await import('./services/supabaseService.js');
            const result = await userService.getAllUsers();
            
            if (result.success) {
                res.json({ 
                    success: true, 
                    data: result.data 
                });
            } else {
                res.json({ 
                    success: false, 
                    message: 'Error fetching users: ' + result.error
                });
            }
        } else {
            res.json({ 
                success: false, 
                message: 'Database not configured'
            });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching users',
            error: error.message 
        });
    }
});

// Handle contract template fetching for dropdown
app.get('/api/contract-templates', async (req, res) => {
    try {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            const { contractTemplateService } = await import('./services/supabaseService.js');
            const result = await contractTemplateService.getAllContractTemplates();
            
            if (result.success) {
                res.json({ 
                    success: true, 
                    data: result.data 
                });
            } else {
                res.json({ 
                    success: false, 
                    message: 'Error fetching contract templates: ' + result.error
                });
            }
        } else {
            res.json({ 
                success: false, 
                message: 'Database not configured'
            });
        }
    } catch (error) {
        console.error('Error fetching contract templates:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching contract templates',
            error: error.message 
        });
    }
});

// Handle listings fetching for property dropdown
app.get('/api/listings', async (req, res) => {
    try {
        if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
            const { listingsService } = await import('./services/supabaseService.js');
            const result = await listingsService.getAllListings();
            
            if (result.success) {
                res.json({ 
                    success: true, 
                    data: result.data 
                });
            } else {
                res.json({ 
                    success: false, 
                    message: 'Error fetching listings: ' + result.error
                });
            }
        } else {
            res.json({ 
                success: false, 
                message: 'Database not configured'
            });
        }
    } catch (error) {
        console.error('Error fetching listings:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error fetching listings',
            error: error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Press Ctrl+C to stop the server`);
});
