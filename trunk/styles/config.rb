# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)
#dir = "/var/www"

# Load the sencha-touch framework automatically.
#load File.join('/home/martinme/www/sencha-touch-2.0.1.1', 'resources', 'themes')
load File.join('/var/www/sencha-touch-2.0.1.1', 'resources', 'themes')

# Compass configurations
sass_path = dir
css_path = File.join(dir, "..", "resources", "css")

# Require any additional compass plugins here.
images_dir = File.join(dir, "..", "resources", "images")
#output_style = :compressed
#environment = :production
output_style = :expanded
environment = :development
