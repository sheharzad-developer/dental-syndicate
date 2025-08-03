from flask import Flask
import os

# Get the directory of this file
current_dir = os.path.dirname(os.path.abspath(__file__))
# Get the parent directory (project root)
project_root = os.path.dirname(current_dir)

app = Flask(__name__, 
           template_folder=os.path.join(project_root, 'templates'),
           static_folder=os.path.join(project_root, 'static'),
           static_url_path='/static')

app.secret_key = '37d54b82eb57a56f4a2aa7f3079923d122517cbe307df03db88ecf05bf02702d'

# Import all routes from the original app
from flask import render_template, request, jsonify

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
            
            # Log appointment for admin review (Vercel function logs)
            print(f"🏥 NEW APPOINTMENT BOOKED - Dental Syndicate")
            print(f"Patient: {name} | Phone: {phone} | Email: {email}")
            print(f"Date: {date} | Time: {time} | Service: {service}")
            print(f"Message: {message if message else 'None'}")
            print("---")
            
            return jsonify({
                'success': True, 
                'message': 'Appointment request submitted successfully! We will contact you soon to confirm.'
            })
            
        except Exception as e:
            print(f"Error processing appointment: {str(e)}")
            return jsonify({'success': False, 'message': 'An error occurred. Please try again.'})
    
    return render_template('appointment.html')

# Vercel entry point
from werkzeug.wrappers import Request, Response

def application(environ, start_response):
    return app.wsgi_app(environ, start_response)