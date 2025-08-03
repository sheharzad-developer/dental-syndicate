from flask import Flask, render_template, request, jsonify
import os
import sys

# Add the parent directory to the path so we can import from the root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__, 
           template_folder='../templates', 
           static_folder='../static',
           static_url_path='/static')

app.secret_key = '37d54b82eb57a56f4a2aa7f3079923d122517cbe307df03db88ecf05bf02702d'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/doctors')
def doctors():
    return render_template('doctors.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/appointment', methods=['GET', 'POST'])
def appointment():
    if request.method == 'POST':
        try:
            # Get form data
            name = request.form.get('name')
            email = request.form.get('email')
            phone = request.form.get('phone')
            date = request.form.get('date')
            time = request.form.get('time')
            service = request.form.get('service')
            message = request.form.get('message', '')
            
            # Validate required fields
            if not all([name, email, phone, date, time, service]):
                return jsonify({'success': False, 'message': 'Please fill in all required fields.'})
            
            # For Vercel deployment, we'll log the appointment instead of sending SMS/WhatsApp
            # since serverless functions don't support background threading
            appointment_data = {
                'name': name,
                'email': email,
                'phone': phone,
                'date': date,
                'time': time,
                'service': service,
                'message': message
            }
            
            # Log appointment for admin review
            print(f"🏥 NEW APPOINTMENT BOOKED - Dental Syndicate")
            print(f"Patient: {name} | Phone: {phone} | Email: {email}")
            print(f"Date: {date} | Time: {time} | Service: {service}")
            print(f"Message: {message if message else 'None'}")
            print("---")
            
            # Note: In production, you would save this to a database
            # or send to an external service like Zapier, Airtable, or email service
            
            return jsonify({
                'success': True, 
                'message': 'Appointment request submitted successfully! We will contact you soon to confirm.'
            })
            
        except Exception as e:
            print(f"Error processing appointment: {str(e)}")
            return jsonify({'success': False, 'message': 'An error occurred. Please try again.'})
    
    return render_template('appointment.html')

# For Vercel serverless deployment
def handler(request):
    return app(request.environ, lambda status, headers: None)

# This is the entry point for Vercel
app_handler = app