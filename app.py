from flask import Flask, render_template, request, jsonify, flash
import requests
import pywhatkit as kit
import datetime
import threading
import time
import os

app = Flask(__name__)
app.secret_key = '37d54b82eb57a56f4a2aa7f3079923d122517cbe307df03db88ecf05bf02702d'  # Change this to a secure secret key

# SMS Configuration
SMS_API_URL = "https://textbelt.com/text"  # Free SMS service

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

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 8000)))