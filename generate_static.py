from flask_frozen import Freezer
from app import app

freezer = Freezer(app)

if __name__ == '__main__':
    print("Generating static files...")
    freezer.freeze()
    print("Static files generated successfully in 'build' folder!")
    print("Upload the contents of the 'build' folder to your GoDaddy public_html directory.")
