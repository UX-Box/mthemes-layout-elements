## Mountain Themes Layout Elements
This Wordpress plugin let you use Advanced Custom Fields Pro with SiteOrigin Page Builder, specifically this plugin enable the visualisations of Acf fields inside the widget edit panels of Site Origin Page Builder.

### Installation

1. First make sure Advanced Custom Fields Pro and Site Origin Page Builder are installed and active.
2. Install and activate this plugin.
3. Activate The Layout Elements Field Group inside Custom Fields > Field Groups > Sync Available.
4. Done :)

### Usage
You need to follow these steps to create new widgets:

1. Create a new field inside the Layout Elements Flexible Content Field (Layout Elements Field Group).
2. Register a new widget with a class which extends "Mthemes_Widget" (see the Image widget inside widgets/mthemes-image-widget.php).
3. Now you should see the Acf fields inside the widget edit screen.