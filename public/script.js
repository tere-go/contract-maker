// DOM elements
const contractForm = document.getElementById('contractForm');
const successMessage = document.createElement('div');
const templateButton = document.querySelector('.btn-template');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupForm();
    setupSuccessMessage();
    setupTemplateButton();
    
    // Delay dropdown population to ensure server is ready
    setTimeout(() => {
        populateAgentDropdown();
        populateContractTypeDropdown();
        populatePropertyDropdown();
    }, 1000);
});

// Setup form event listeners
function setupForm() {
    contractForm.addEventListener('submit', handleFormSubmit);
    
    // Add input focus effects for all form elements
    const inputs = document.querySelectorAll('.form-select, .form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', addFocusEffect);
        input.addEventListener('blur', removeFocusEffect);
    });
}

// Setup template button
function setupTemplateButton() {
    if (templateButton) {
        templateButton.addEventListener('click', handleTemplateCreation);
    }
}

// Store users data globally for email lookup
let usersData = [];

// Populate agent dropdown with users from Supabase
async function populateAgentDropdown() {
    try {
        console.log('🔄 Attempting to fetch users...');
        
        const response = await fetch('/api/users');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📡 API response:', result);
        
        if (result.success && result.data) {
            const agentSelect = document.getElementById('agent');
            
            // Store users data globally
            usersData = result.data;
            
            // Clear existing options except the first placeholder
            agentSelect.innerHTML = '<option value="">Select agent</option>';
            
            // Add user options in format [user_id user_name]
            console.log('🔍 Raw user data:', result.data);
            
            result.data.forEach(user => {
                console.log('🔍 Individual user object:', user);
                const option = document.createElement('option');
                option.value = user.user_id;
                option.textContent = `[${user.user_id} ${user.user_name}]`;
                agentSelect.appendChild(option);
            });
            
            // Add change event listener to show email
            agentSelect.addEventListener('change', handleAgentChange);
            
            console.log('✅ Agent dropdown populated with', result.data.length, 'users');
        } else {
            console.warn('⚠️ Could not populate agent dropdown:', result.message);
        }
    } catch (error) {
        console.error('❌ Error populating agent dropdown:', error);
        
        // Retry after a short delay
        setTimeout(() => {
            console.log('🔄 Retrying agent dropdown population...');
            populateAgentDropdown();
        }, 2000);
    }
}

// Store contract templates data globally for contract_type lookup
let contractTemplatesData = [];

// Store listings data globally for property lookup
let listingsData = [];

// Populate contract type dropdown with templates from Supabase
async function populateContractTypeDropdown() {
    try {
        console.log('🔄 Attempting to fetch contract templates...');
        
        const response = await fetch('/api/contract-templates');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📡 Contract templates API response:', result);
        
        if (result.success && result.data) {
            const contractTypeSelect = document.getElementById('contractType');
            
            // Store contract templates data globally
            contractTemplatesData = result.data;
            
            // Clear existing options except the first placeholder
            contractTypeSelect.innerHTML = '<option value="">Select contract type</option>';
            
            // Add template options (display template_name, but store contract_type)
            console.log('🔍 Raw contract template data:', result.data);
            
            result.data.forEach(template => {
                console.log('🔍 Individual template object:', template);
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.template_name;
                // Store template_name as a data attribute for contract type
                option.setAttribute('data-contract-type', template.template_name);
                // Store template_link as a data attribute for contractType field
                option.setAttribute('data-template-link', template.template_link);
                contractTypeSelect.appendChild(option);
            });
            
            // Add change event listener to capture contract_type
            contractTypeSelect.addEventListener('change', handleContractTypeChange);
            
            console.log('✅ Contract type dropdown populated with', result.data.length, 'templates');
        } else {
            console.warn('⚠️ Could not populate contract type dropdown:', result.message);
        }
    } catch (error) {
        console.error('❌ Error populating contract type dropdown:', error);
        
        // Retry after a short delay
        setTimeout(() => {
            console.log('🔄 Retrying contract type dropdown population...');
            populateContractTypeDropdown();
        }, 2000);
    }
}

// Populate property dropdown with listings from Supabase
async function populatePropertyDropdown() {
    try {
        console.log('🔄 Attempting to fetch listings...');
        
        const response = await fetch('/api/listings');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📡 Listings API response:', result);
        
        if (result.success && result.data) {
            const propertySelect = document.getElementById('property');
            
            // Store listings data globally
            listingsData = result.data;
            
            // Clear existing options except the first placeholder
            propertySelect.innerHTML = '<option value="">Select a property</option>';
            
            // Add property options in format [list_num list_name]
            console.log('🔍 Raw listings data:', result.data);
            
            result.data.forEach(listing => {
                console.log('🔍 Individual listing object:', listing);
                const option = document.createElement('option');
                option.value = listing.list_num;
                option.textContent = `[${listing.list_num} ${listing.list_name}]`;
                propertySelect.appendChild(option);
            });
            
            // Add change event listener to capture property selection
            propertySelect.addEventListener('change', handlePropertyChange);
            
            console.log('✅ Property dropdown populated with', result.data.length, 'listings');
        } else {
            console.warn('⚠️ Could not populate property dropdown:', result.message);
        }
    } catch (error) {
        console.error('❌ Error populating property dropdown:', error);
        
        // Retry after a short delay
        setTimeout(() => {
            console.log('🔄 Retrying property dropdown population...');
            populatePropertyDropdown();
        }, 2000);
    }
}

// Handle contract type selection change
function handleContractTypeChange(event) {
    const selectedTemplateId = event.target.value;
    
    if (selectedTemplateId) {
        console.log('🔍 Template ID selected:', selectedTemplateId);
        console.log('🔍 Template Name selected:', event.target.options[event.target.selectedIndex].textContent);
        
        // You can store this value or use it as needed
        // For now, just logging it to console
    } else {
        console.log('🔄 No contract type selected');
    }
}

// Handle property selection change
function handlePropertyChange(event) {
    const selectedPropertyNum = event.target.value;
    
    if (selectedPropertyNum) {
        const selectedProperty = listingsData.find(listing => listing.list_num === selectedPropertyNum);
        console.log('🔍 Property selected:', selectedProperty);
        console.log('🔍 List Number selected:', selectedPropertyNum);
        console.log('🔍 List Name:', selectedProperty?.list_name);
        
        // You can store this value or use it as needed
        // For now, just logging it to console
    } else {
        console.log('🔄 No property selected');
    }
}

// Helper function to get selected agent's email
function getSelectedAgentEmail() {
    const agentSelect = document.getElementById('agent');
    const selectedUserId = agentSelect.value;
    
    if (selectedUserId) {
        const selectedUser = usersData.find(user => user.user_id === selectedUserId);
        return selectedUser?.user_email || '';
    }
    return '';
}

// Helper function to get selected contract type value
function getSelectedContractTypeName() {
    const contractTypeSelect = document.getElementById('contractType');
    const selectedOption = contractTypeSelect.options[contractTypeSelect.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        // Get the contract type from the data attribute (which stores template_name)
        return selectedOption.getAttribute('data-contract-type') || '';
    }
    return '';
}

// Helper function to get selected contract type's template link
function getSelectedContractTypeLink() {
    const contractTypeSelect = document.getElementById('contractType');
    const selectedOption = contractTypeSelect.options[contractTypeSelect.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        // Get the template_link from the data attribute
        return selectedOption.getAttribute('data-template-link') || '';
    }
    return '';
}

// Handle agent selection change to show email
function handleAgentChange(event) {
    const selectedUserId = event.target.value;
    const agentEmailElement = document.getElementById('agentEmail');
    
    console.log('🔍 Agent selection changed:', selectedUserId);
    console.log('🔍 Available users data:', usersData);
    
    if (selectedUserId) {
        // Find the selected user in our stored data
        const selectedUser = usersData.find(user => user.user_id === selectedUserId);
        console.log('🔍 Selected user:', selectedUser);
        
        if (selectedUser && selectedUser.user_email) {
            agentEmailElement.textContent = `Contract will be sent to: ${selectedUser.user_email}`;
            agentEmailElement.style.display = 'block';
            console.log('✅ Email displayed:', selectedUser.user_email);
        } else {
            agentEmailElement.textContent = 'Agent Email: Not available';
            agentEmailElement.style.display = 'block';
            console.log('⚠️ Email not available for user');
        }
    } else {
        // No agent selected, hide the email
        agentEmailElement.style.display = 'none';
        console.log('🔄 Email hidden - no agent selected');
    }
}

// Setup success message element
function setupSuccessMessage() {
    successMessage.className = 'success-message';
    successMessage.style.display = 'none';
    contractForm.appendChild(successMessage);
}

// Handle form submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(contractForm);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Show loading state
    const submitBtn = contractForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    try {
        // Prepare webhook payload
        const webhookPayload = {
            agent: formObject.agent,
            agentEmail: getSelectedAgentEmail(),
            contractType: getSelectedContractTypeLink(),
            contractNameType: getSelectedContractTypeName(),
            propertyId: formObject.property,
            sellerName: formObject.sellerName,
            customerName: formObject.customerName,
            signingPlace: formObject.signingPlace,
            timestamp: new Date().toISOString(),
            source: "contract-creator-form"
        };
        
        console.log('📤 Sending webhook payload:', webhookPayload);
        
        // Send to webhook
        const response = await fetch('http://localhost:5678/webhook-test/f0c9f88c-4900-45d5-b51a-f9dbbf707eb5', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookPayload)
        });
        
        if (response.ok) {
            showSuccessMessage('Contract sent to webhook successfully!');
            contractForm.reset();
            // Clear email display
            document.getElementById('agentEmail').style.display = 'none';
        } else {
            const errorText = await response.text();
            showSuccessMessage(`Webhook error: ${response.status} - ${errorText}`, 'error');
        }
        
    } catch (error) {
        console.error('Error sending to webhook:', error);
        showSuccessMessage('Network error sending to webhook. Please check your connection.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Show success/error message
function showSuccessMessage(message, type = 'success') {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    
    if (type === 'error') {
        successMessage.style.background = 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)';
        successMessage.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
    } else {
        successMessage.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        successMessage.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3)';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

// Clear form function
function clearForm() {
    contractForm.reset();
    successMessage.style.display = 'none';
    
    // Remove focus effects
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        removeFocusEffect({ target: input });
    });
    
    // Show confirmation
    showSuccessMessage('Form cleared successfully!');
}

// Add focus effect to form elements
function addFocusEffect(event) {
    const element = event.target;
    element.style.transform = 'scale(1.02)';
    element.style.transition = 'transform 0.2s ease';
}

// Remove focus effect from form elements
function removeFocusEffect(event) {
    const element = event.target;
    element.style.transform = 'scale(1)';
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Close any open modals or clear form
        clearForm();
    }
    
    if (event.key === 'Enter' && event.ctrlKey) {
        // Submit form with Ctrl+Enter
        event.preventDefault();
        contractForm.dispatchEvent(new Event('submit'));
    }
});

// Add form validation feedback
function validateField(field) {
    const value = field.value.trim();
    const isValid = value.length > 0;
    
    if (isValid) {
        field.style.borderColor = '#28a745';
        field.style.boxShadow = '0 0 0 3px rgba(40, 167, 69, 0.1)';
    } else {
        field.style.borderColor = '#dc3545';
        field.style.boxShadow = '0 0 0 3px rgba(220, 53, 69, 0.1)';
    }
    
    return isValid;
}

// Handle template creation
async function handleTemplateCreation() {
    try {
        // Get current form data
        const formData = new FormData(contractForm);
        const templateData = {};
        
        formData.forEach((value, key) => {
            templateData[key] = value;
        });
        
        // Add template metadata
        templateData.name = `Template - ${new Date().toLocaleDateString()}`;
        templateData.created_at = new Date().toISOString();
        
        // Show loading state
        templateButton.textContent = 'Creating Template...';
        templateButton.disabled = true;
        
        // Send to server
        const response = await fetch('/api/templates', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(templateData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showSuccessMessage('Template created successfully!', 'success');
        } else {
            showSuccessMessage('Error creating template: ' + result.message, 'error');
        }
        
    } catch (error) {
        console.error('Error creating template:', error);
        showSuccessMessage('Network error creating template', 'error');
    } finally {
        // Reset button state
        templateButton.textContent = 'Create a New Template';
        templateButton.disabled = false;
    }
}

// Add real-time validation for remaining form elements
const inputs = document.querySelectorAll('.form-select, .form-input');
inputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    input.addEventListener('change', function() {
        if (this.style.borderColor === 'rgb(220, 53, 69)') {
            validateField(this);
        }
    });
});
