# 3DSmartTrafficAndParkingManagement
Microsoft Fabric Hackathon

## Real-Time Traffic and Parking Web App
This web application provides real-time traffic and parking data for Melbourne, Australia, integrating multiple data sources to offer users an intuitive map view and live updates on traffic conditions and parking availability.

# Features
# Real-Time Traffic Data:
The app integrates the TomTom Traffic API to provide live traffic flow data, displaying congestion levels in Melbourne.
Traffic data is displayed on an interactive map, where users can see real-time traffic conditions.

# Real-Time Parking Data:
The app uses the Melbourne Open Data API to provide near real-time parking availability data for on-street parking in Melbourne.
Parking spot information, including locations and availability status, is shown on the map, helping users find parking spots in their area.

# Interactive Map:
Mapbox is used to render a detailed and interactive map of Melbourne, displaying both traffic and parking data.
Users can toggle between different layers on the map, including traffic flow and parking availability.

# Live Location:
The app features a live location feature that shows the user's current location on the map with a blue circle, indicating the user's position. A red radius highlights nearby parking spots.

# Real-Time Updates:
The app fetches data in near real-time, ensuring that users always have up-to-date traffic and parking information.

# Technologies Used
# Frontend:
Mapbox GL JS: For rendering the interactive map with real-time traffic and parking data.
HTML, CSS, JavaScript: Used for building the user interface and handling interactivity.

## Use this command to start the server
python -m http.server 8000

# Links to microsot Fabric: 
Lakehouse: https://onelake.dfs.fabric.microsoft.com/b4889712-b95c-471c-841c-68382445235c/4ae50e66-9c3d-47fe-93fb-e453d52f13be/Tables


TomTom Traffic API: Provides real-time traffic data, including congestion levels and traffic flow information.
Melbourne Open Data API: Provides near real-time parking data, including the availability of parking spots in Melbourne.

# Backend:
Microsoft Fabric: Used for managing and processing the data pipeline (although not currently used in the app, it’s ready for future real-time intelligence integration).
EventStream (future integration): Potentially used for real-time event processing and alerts based on traffic or parking conditions.

I set up data pipelines to fetch real-time traffic and parking data from APIs like TomTom and Melbourne Open Data, storing it in Microsoft Fabric's Lakehouse. While the integration with the web app isn't complete yet, the pipelines are fully functional, and the foundation for incorporating real-time data into the app is in place. This sets the stage for dynamic, up-to-date traffic and parking insights in the future.

![chart](https://github.com/user-attachments/assets/f32b84ba-2274-4df7-ade7-f1100ffd5e81)
Here is an image of the viz created using notebook from microsoft fabric. 


Parking Spots: 
![image](https://github.com/user-attachments/assets/0db16022-ec85-44c4-8ff8-8e7370b8e0e1)

