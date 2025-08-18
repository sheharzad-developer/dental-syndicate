from flask import Flask, render_template, request, jsonify, flash, send_from_directory
from flask_mail import Mail, Message
import requests
import pywhatkit as kit
import datetime
import threading
import time
import os
import json
from datetime import datetime as dt

app = Flask(__name__)
app.secret_key = '37d54b82eb57a56f4a2aa7f3079923d122517cbe307df03db88ecf05bf02702d'  # Change this to a secure secret key

# Email Configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME', 'your-email@gmail.com')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD', 'your-app-password')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_DEFAULT_SENDER', 'Behzad Dental Clinic <your-email@gmail.com>')

# Initialize Flask-Mail
mail = Mail(app)

# SMS Configuration
SMS_API_URL = "https://textbelt.com/text"  # Free SMS service

# Appointment storage file
APPOINTMENTS_FILE = 'appointments.json'

# Helper functions for appointment management
def load_appointments():
    """Load appointments from JSON file"""
    try:
        if os.path.exists(APPOINTMENTS_FILE):
            with open(APPOINTMENTS_FILE, 'r') as f:
                return json.load(f)
        return []
    except Exception as e:
        print(f"Error loading appointments: {e}")
        return []

def save_appointment(appointment_data):
    """Save appointment to JSON file"""
    try:
        appointments = load_appointments()
        appointment_data['id'] = len(appointments) + 1
        appointment_data['created_at'] = dt.now().isoformat()
        appointment_data['source'] = 'calendly'
        appointments.append(appointment_data)
        
        with open(APPOINTMENTS_FILE, 'w') as f:
            json.dump(appointments, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving appointment: {e}")
        return False

def send_appointment_list_email(recipient_email, appointments):
    """Send appointment list via email"""
    try:
        msg = Message(
            subject='Appointment List - Behzad Dental Clinic',
            recipients=[recipient_email]
        )
        
        # Create HTML email content
        html_content = render_template('email/appointment_list.html', appointments=appointments)
        msg.html = html_content
        
        # Create plain text version
        text_content = f"""Appointment List - Behzad Dental Clinic

Total Appointments: {len(appointments)}

"""
        
        for i, apt in enumerate(appointments, 1):
            text_content += f"""{i}. {apt.get('name', 'N/A')}
   Email: {apt.get('email', 'N/A')}
   Phone: {apt.get('phone', 'N/A')}
   Date: {apt.get('date', 'N/A')}
   Time: {apt.get('time', 'N/A')}
   Service: {apt.get('service', 'N/A')}
   Created: {apt.get('created_at', 'N/A')}

"""
        
        msg.body = text_content
        
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/doctors')
def doctors():
    return render_template('doctors.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/robots.txt')
def robots_txt():
    return send_from_directory('static', 'robots.txt')

@app.route('/sitemap.xml')
def sitemap_xml():
    return send_from_directory('static', 'sitemap.xml')

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
            
            # Format appointment notification for doctor (SMS)
            sms_message = f"""🏥 NEW APPOINTMENT BOOKED
Behzad Dental Clinic

Patient: {name}
Phone: {phone}
Email: {email}
Date: {date}
Time: {time}
Service: {service}
Additional Info: {message if message else 'None'}"""
            
            # Doctor's phone number for notifications
            doctor_phone = "+92 331 4864899"  # Behzad's clinic number
            
            # Send SMS notification to doctor
            def send_sms():
                try:
                    print(f"Attempting to send SMS notification to doctor: {doctor_phone}")
                    
                    # Prepare SMS data for TextBelt API
                    sms_data = {
                        'phone': doctor_phone,
                        'message': sms_message,
                        'key': '2c15f60829e346c72d5ccfbc267a138348e22a76we9CZmypwuvlWisFzm8oeAVs8'  # Your SMS API key
                    }
                    
                    # Send SMS using TextBelt API
                    response = requests.post(SMS_API_URL, data=sms_data, timeout=10)
                    
                    if response.status_code == 200:
                        result = response.json()
                        if result.get('success'):
                            print("SMS notification sent successfully to doctor!")
                        else:
                            print(f"SMS failed: {result.get('error', 'Unknown error')}")
                    else:
                        print(f"SMS API error: HTTP {response.status_code}")
                        
                except Exception as e:
                    print(f"Error sending SMS to doctor: {str(e)}")
                    print("SMS notification failed, but appointment was still booked successfully.")
            
            # Send WhatsApp notification to doctor
            def send_whatsapp():
                try:
                    print(f"Attempting to send WhatsApp notification to doctor: {doctor_phone}")
                    
                    # Format WhatsApp message for doctor notification
                    whatsapp_message = f"""🏥 *NEW APPOINTMENT BOOKED*
*Behzad Dental Clinic*

📋 *Patient Details:*
👤 *Name:* {name}
📧 *Email:* {email}
📞 *Phone:* {phone}

📅 *Appointment Details:*
📅 *Date:* {date}
🕐 *Time:* {time}
🦷 *Service:* {service}

💬 *Additional Information:*
{message if message else 'None provided'}

📍 *Clinic Address:*
131-BWD, Fourth Floor، Commercial Broadway, DHA Phase 8, Lahore, 54000

---
*Please confirm availability*"""
                    
                    # Send WhatsApp message to doctor
                    kit.sendwhatmsg_instantly(doctor_phone, whatsapp_message, 15, True, 2)
                    print("WhatsApp notification sent successfully to doctor!")
                    
                except Exception as e:
                    print(f"Error sending WhatsApp to doctor: {str(e)}")
                    print("WhatsApp notification failed, but appointment was still booked successfully.")
            
            # Start both SMS and WhatsApp notifications to doctor in background
            threading.Thread(target=send_sms, daemon=True).start()
            threading.Thread(target=send_whatsapp, daemon=True).start()
            
            return jsonify({
                'success': True, 
                'message': 'Appointment booked successfully! You will receive a confirmation shortly.'
            })
            
        except Exception as e:
            print(f"Error processing appointment: {str(e)}")
            return jsonify({'success': False, 'message': 'An error occurred. Please try again.'})
    
    return render_template('appointment.html')

@app.route('/calendly-webhook', methods=['POST'])
def calendly_webhook():
    """Handle Calendly webhook for new appointments"""
    try:
        data = request.get_json()
        
        # Extract appointment data from Calendly webhook
        if data and data.get('event') == 'invitee.created':
            payload = data.get('payload', {})
            
            appointment_data = {
                'name': payload.get('name', ''),
                'email': payload.get('email', ''),
                'phone': payload.get('text_reminder_number', ''),
                'date': payload.get('scheduled_event', {}).get('start_time', ''),
                'time': payload.get('scheduled_event', {}).get('start_time', ''),
                'service': payload.get('scheduled_event', {}).get('name', 'Consultation'),
                'calendly_uri': payload.get('uri', ''),
                'status': 'scheduled'
            }
            
            # Save appointment to local storage
            if save_appointment(appointment_data):
                print(f"New Calendly appointment saved: {appointment_data['name']}")
            
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        print(f"Error processing Calendly webhook: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 400

@app.route('/admin/appointments')
def admin_appointments():
    """Admin page to view all appointments"""
    appointments = load_appointments()
    return render_template('admin/appointments.html', appointments=appointments)

@app.route('/admin/send-appointment-list', methods=['POST'])
def send_appointment_list():
    """Send appointment list via email"""
    try:
        email = request.form.get('email')
        if not email:
            return jsonify({'success': False, 'message': 'Email address is required'})
        
        appointments = load_appointments()
        
        if send_appointment_list_email(email, appointments):
            return jsonify({
                'success': True, 
                'message': f'Appointment list sent successfully to {email}'
            })
        else:
            return jsonify({
                'success': False, 
                'message': 'Failed to send email. Please check email configuration.'
            })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/api/appointments')
def api_appointments():
    """API endpoint to get appointments as JSON"""
    appointments = load_appointments()
    return jsonify(appointments)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))