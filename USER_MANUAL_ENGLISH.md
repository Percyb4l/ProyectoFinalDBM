# 📘 VriSA User Manual

## Welcome to VriSA! 🌍

Welcome to **VriSA** (Sistema de Vigilancia y Reporte de Información Ambiental), your comprehensive environmental monitoring platform. This manual will help you navigate and use the system effectively, regardless of your role or technical background.

---

## 📖 Introduction

### What is VriSA?

VriSA is an **environmental monitoring and reporting system** designed to help organizations and citizens track air quality and environmental conditions in real-time. Think of it as a digital dashboard that collects data from monitoring stations placed throughout your area, analyzes that information, and presents it in an easy-to-understand format.

### What Can VriSA Do?

✅ **Monitor Air Quality**: Track pollutants like PM2.5, PM10, and ozone levels  
✅ **View Real-Time Data**: See current environmental conditions from multiple monitoring stations  
✅ **Historical Analysis**: Review trends and patterns over time  
✅ **Alert System**: Get notified when air quality reaches concerning levels  
✅ **Multi-Organization Support**: Different institutions can manage their own monitoring networks  
✅ **Public Access**: Citizens can view environmental data without logging in  

### Who Uses VriSA?

- **🌍 Citizens**: Anyone who wants to check air quality in their area
- **👷 Station Operators**: People who maintain and operate monitoring equipment
- **🏛️ Institution Administrators**: Managers who oversee multiple stations
- **👨‍💼 System Administrators**: Technical staff who manage the entire platform

---

## 🚀 Quick Start Guide

### Accessing the Public Dashboard

The public dashboard is available to everyone - no login required! Here's how to access it:

1. **Open your web browser** (Chrome, Firefox, Safari, or Edge)
2. **Navigate to the VriSA website** (your organization will provide the URL)
3. **You'll see the public dashboard** with:
   - 📊 Current air quality indicators at the top
   - 🗺️ An interactive map showing monitoring stations
   - 📈 Historical trend charts
   - 🔍 Filter options to customize your view

### Understanding the Dashboard

#### 📊 Indicator Cards
At the top of the dashboard, you'll see cards showing:
- **ICA Actual**: Current Air Quality Index (overall air quality score)
- **PM2.5**: Fine particle pollution levels
- **PM10**: Coarse particle pollution levels
- **O3**: Ozone levels

Each card shows:
- The current measurement value
- A progress bar indicating the level (green = good, yellow = moderate, red = poor)

#### 🗺️ Interactive Map
The map displays:
- **Monitoring station locations** as points on the map
- Click on a station to see its details
- Different colors may indicate different air quality levels

#### 🔍 Filters
Use the filter panel to:
- **Select a pollutant** (PM2.5, PM10, O3, etc.)
- **Choose a time period** (today, last week, last month)
- **Pick a specific station** or view all stations
- Click **"Aplicar filtros"** (Apply Filters) to update the view

#### 📈 Historical Trends
Scroll down to see:
- Charts showing how air quality has changed over time
- Patterns and trends in environmental data

---

## 👥 Role-Based User Guides

### 🌍 For Citizens (Public Users)

As a citizen, you can access all public information without creating an account. Here's what you can do:

#### Viewing Environmental Data

**Step 1: Access the Dashboard**
- Open the VriSA website in your browser
- The public dashboard loads automatically

**Step 2: Check Current Air Quality**
- Look at the indicator cards at the top
- Each card shows a measurement value and a colored progress bar
- **Green**: Good air quality ✅
- **Yellow**: Moderate air quality ⚠️
- **Orange/Red**: Poor air quality - consider limiting outdoor activities ❌

**Step 3: Explore the Map**
- Find your location on the interactive map
- Look for nearby monitoring stations (marked with pins or dots)
- Click on a station to see its current readings

**Step 4: Filter Data**
- Use the filter panel on the right side
- Select a specific pollutant you're interested in
- Choose a time period to see historical data
- Select a station if you want data from a specific location
- Click **"Aplicar filtros"** to update the display

**Step 5: View Historical Trends**
- Scroll down to the "Gráficas de Tendencias Históricas" (Historical Trends Charts) section
- You'll see at least one chart by default
- **To add more charts**: Click the **"+ Agregar Gráfica"** (Add Chart) button
- **To configure a chart**:
  - Select a **Station** from the dropdown
  - Select a **Variable** (e.g., PM2.5, PM10, O3) from the dropdown
  - The chart will automatically update to show the last 7 days of data
- **To remove a chart**: Click the **×** button in the top-right corner of the chart (only visible when you have more than one chart)
- **Chart features**:
  - Hover over data points to see exact values and timestamps
  - Red dashed line shows the critical threshold (if applicable)
  - X-axis shows dates and times
  - Y-axis shows measurement values with units
- Look for patterns (e.g., worse air quality during rush hour)

#### Interpreting Measurements

**Understanding the Numbers:**
- **PM2.5** (µg/m³): Fine particles that can enter your lungs
  - 0-12: Good
  - 12-35: Moderate
  - 35-55: Unhealthy for sensitive groups
  - Above 55: Unhealthy

- **PM10** (µg/m³): Larger particles
  - 0-54: Good
  - 55-154: Moderate
  - Above 154: Unhealthy

- **O3** (ppb): Ozone at ground level
  - 0-54: Good
  - 55-70: Moderate
  - Above 70: Unhealthy

**What to Do Based on Readings:**
- ✅ **Good/Moderate**: Normal outdoor activities are fine
- ⚠️ **Unhealthy for Sensitive Groups**: Children, elderly, and people with respiratory issues should limit outdoor time
- ❌ **Unhealthy**: Everyone should limit outdoor activities, especially exercise

---

### 👷 For Station Operators

Station operators manage the physical monitoring equipment and ensure data is being collected properly.

#### Logging In

**Step 1: Access the Login Page**
- Click **"Acceso administrativo"** (Administrative Access) on the public dashboard
- Or navigate directly to the login page

**Step 2: Enter Your Credentials**
- Enter your **email address**
- Enter your **password**
- Click **"Iniciar sesión"** (Log In)

**Step 3: Navigate to Your Dashboard**
- After logging in, you'll see the admin dashboard
- The sidebar menu shows all available options

#### Registering a New Station

**Step 1: Navigate to Stations**
- Click **"Estaciones"** (Stations) in the left sidebar menu

**Step 2: Open the Creation Form**
- Click the **"+ Nueva Estación"** (New Station) button at the top right

**Step 3: Fill in Station Information**
- **Nombre de la estación** (Station Name): Enter a descriptive name (e.g., "Estación Centro")
- **Latitud** (Latitude): Enter the GPS latitude coordinate (e.g., 4.6097)
- **Longitud** (Longitude): Enter the GPS longitude coordinate (e.g., -74.0817)
- **Estado** (Status): Select from:
  - **Activa**: Station is operational
  - **Inactiva**: Station is not currently operating
  - **Mantenimiento**: Station is under maintenance
- **Institución** (Institution): Select the institution that owns this station (if applicable)

**Step 4: Save the Station**
- Click **"Crear"** (Create) to save
- The station will appear in the stations list

**💡 Tip**: You can find GPS coordinates using Google Maps - right-click on a location and select "What's here?"

#### Checking Sensor Status

**Step 1: Navigate to Sensors**
- Click **"Sensores"** (Sensors) in the left sidebar menu

**Step 2: Select a Station**
- Use the **"Filtrar por estación"** (Filter by Station) dropdown
- Select the station you want to check

**Step 3: Review Sensor List**
- You'll see all sensors for that station
- Check the **"Estado"** (Status) column:
  - **Activo** (green badge): Sensor is working properly ✅
  - **Inactivo** (red badge): Sensor needs attention ❌

**Step 4: Add a New Sensor (if needed)**
- Click **"+ Nuevo Sensor"** (New Sensor)
- Fill in:
  - **Estación**: Select the station
  - **Modelo**: Sensor model name
  - **Marca**: Sensor manufacturer
  - **Estado**: Active or Inactive
- Click **"Crear"** (Create)

#### Viewing Measurements

**Step 1: Navigate to Measurements**
- Click **"Mediciones"** (Measurements) in the sidebar

**Step 2: Select a Station**
- Choose a station from the **"Estación"** dropdown (required)

**Step 3: Apply Filters (Optional)**
- **Variable**: Select a specific pollutant (PM2.5, O3, etc.) or leave as "Todas"
- **Fecha inicio** (Start Date): Choose when to start viewing data
- **Fecha fin** (End Date): Choose when to stop viewing data
- Click **"Últimos 7 días"** (Last 7 Days) for a quick filter
- Click **"Limpiar filtros"** (Clear Filters) to reset

**Step 4: Review the Data**
- The table shows:
  - **ID**: Measurement identifier
  - **Estación**: Station name
  - **Sensor**: Sensor ID
  - **Variable**: What was measured (PM2.5, O3, etc.)
  - **Valor**: The measurement value with units
  - **Fecha/Hora**: When the measurement was taken

**Step 5: Sort Data (Optional)**
- Click any column header to sort by that column
- Click again to reverse the sort order
- Look for the ↑ or ↓ arrow to see the current sort

---

### 🏛️ For Institution Administrators

Institution administrators manage their organization's stations, users, and data.

#### Managing Your Institution

**Step 1: Access Institutions Page**
- Click **"Instituciones"** (Institutions) in the sidebar

**Step 2: View Institution List**
- See all institutions in the system
- Check the **"Verificada"** (Verified) column to see verification status

**Step 3: Create a New Institution**
- Click **"+ Nueva Institución"** (New Institution)
- Fill in:
  - **Nombre de la institución**: Your organization's name
  - **Dirección**: Physical address
  - **Color Primario**: Primary brand color (click to choose)
  - **Color Secundario**: Secondary brand color
- Click **"Crear"** (Create)

**Step 4: Verify an Institution**
- Find the institution in the list
- Click the **✏️ Edit button** (this verifies the institution)
- Verified institutions have a green "✓ Verificada" badge

#### Creating Users

**Step 1: Navigate to Users**
- Click **"Usuarios"** (Users) in the sidebar

**Step 2: Open User Creation Form**
- Click **"+ Crear usuario"** (Create User)

**Step 3: Fill in User Details**
- **Nombre**: User's full name
- **Email**: User's email address (must be unique)
- **Contraseña**: Initial password (user can change later)
- **Rol**: Select the user's role:
  - **Admin General**: Full system access
  - **Admin Institución**: Manages their institution's stations
  - **Operador Estación**: Manages specific stations
  - **Investigador**: Can view and analyze data
  - **Ciudadano**: Basic viewing access

**Step 4: Save the User**
- Click **"Crear usuario"** (Create User)
- The new user will appear in the users list

**Step 5: Manage Existing Users**
- **Edit**: Click **"Editar"** to modify user information
- **Delete**: Click **"Eliminar"** to remove a user (confirm when prompted)

#### Managing Stations

**Step 1: Navigate to Stations**
- Click **"Estaciones"** (Stations) in the sidebar

**Step 2: Search and Filter**
- Use the **"Buscar"** (Search) box to find stations by name
- Filter by **"Estado"** (Status): Active, Inactive, or Maintenance
- Filter by **"Institución"** (Institution): Show only your institution's stations
- Click **"Limpiar filtros"** (Clear Filters) to reset

**Step 3: Create a New Station**
- Click **"+ Nueva Estación"** (New Station)
- Follow the same steps as Station Operators (see above)

**Step 4: Edit or Delete Stations**
- **Edit**: Click the **✏️ Edit button** to modify station details
- **Delete**: Click the **🗑️ Delete button** to remove a station (confirm when prompted)

#### Viewing Alerts

**Step 1: Navigate to Alerts**
- Click **"Alertas"** (Alerts) in the sidebar

**Step 2: Filter Alerts**
- Use the **"Filtrar"** (Filter) dropdown:
  - **Todas**: All alerts
  - **Activas**: Only unresolved alerts
  - **Resueltas**: Only resolved alerts
  - **Severidad Baja/Media/Alta/Crítica**: Filter by severity level

**Step 3: Review Alert Details**
- Each alert shows:
  - **Estación**: Which station generated the alert
  - **Variable**: What pollutant triggered it
  - **Mensaje**: Description of the issue
  - **Severidad**: How serious it is
  - **Estado**: Active or Resolved
  - **Fecha**: When it was created

**Step 4: Resolve an Alert**
- Find an active alert
- Click the **✏️ Edit button** to mark it as resolved
- Resolved alerts show a green "Resuelta" badge

#### Managing Integration Requests

**Step 1: Navigate to Requests**
- Click **"Solicitudes"** (Requests) in the sidebar

**Step 2: Review Requests**
- See all pending integration requests
- Each request shows:
  - **Institución**: Which institution requested
  - **Estado**: Pending, Approved, or Rejected
  - **Fecha**: When it was submitted

**Step 3: Approve or Reject**
- Click **"Aceptar"** (Approve) to approve a request
- Click **"Rechazar"** (Reject) to reject a request
- Approved requests will create new stations in the system

---

### 👨‍💼 For System Administrators

System administrators have full access to manage all aspects of the VriSA platform.

#### Admin Dashboard Overview

**Step 1: Log In**
- Use your administrator credentials
- You'll land on the Admin Dashboard

**Step 2: Review System Statistics**
- The dashboard shows key metrics:
  - **🏢 Estaciones**: Total number of monitoring stations
  - **🏛️ Instituciones**: Number of registered institutions
  - **📡 Sensores**: Total sensor devices
  - **⚠️ Alertas Activas**: Current unresolved alerts

**Step 3: Quick Access Links**
- Use the quick access section to jump to:
  - Gestionar Estaciones (Manage Stations)
  - Gestionar Instituciones (Manage Institutions)
  - Gestionar Sensores (Manage Sensors)
  - Ver Alertas (View Alerts)

**Step 4: View Historical Trends Charts**
- Scroll down on the Admin Dashboard to see the "Gráficas de Tendencias Históricas" section
- **Add a new chart**: Click the **"+ Agregar Gráfica"** (Add Chart) button
- **Configure each chart**:
  - Select a **Station** from the dropdown
  - Select a **Variable** (PM2.5, PM10, O3, etc.) from the dropdown
  - The chart automatically displays the last 7 days of data
- **Remove a chart**: Click the **×** button (only when you have more than one chart)
- **Compare data**: Add multiple charts to compare different stations or variables side by side
- **Interactive features**:
  - Hover over data points to see exact values and timestamps
  - Red dashed line indicates the critical threshold for that variable
  - Charts are responsive and adapt to your screen size

#### Complete System Management

As a system administrator, you have access to all features:

✅ **User Management**: Create, edit, and delete any user  
✅ **Institution Management**: Verify institutions and manage their settings  
✅ **Station Management**: Oversee all stations across all institutions  
✅ **Sensor Management**: Monitor all sensors system-wide  
✅ **Alert Management**: View and resolve alerts from any station  
✅ **Measurement Access**: View measurements from any station  
✅ **Report Generation**: Create system-wide reports  

Follow the same steps outlined in the Institution Administrator section, but remember you have access to **all** institutions and stations, not just your own.

---

## 📚 Glossary

### Environmental Terms

**🌬️ PM2.5 (Particulate Matter 2.5)**
- Tiny particles in the air that are 2.5 micrometers or smaller
- Can enter deep into your lungs
- Measured in micrograms per cubic meter (µg/m³)
- Common sources: vehicle exhaust, industrial emissions, wildfires

**🌪️ PM10 (Particulate Matter 10)**
- Larger particles in the air (up to 10 micrometers)
- Can irritate eyes, nose, and throat
- Measured in micrograms per cubic meter (µg/m³)
- Common sources: dust, pollen, construction sites

**☀️ O3 (Ozone)**
- A gas that forms when pollutants react with sunlight
- At ground level, it's harmful to breathe
- Measured in parts per billion (ppb)
- Higher levels on hot, sunny days

**📊 ICA (Índice de Calidad del Aire / Air Quality Index)**
- A number that summarizes overall air quality
- Combines measurements from different pollutants
- Usually ranges from 0-500, where lower is better
- Color-coded: Green (good), Yellow (moderate), Orange (unhealthy), Red (very unhealthy)

**🎯 Threshold (Umbral)**
- A pre-set value that triggers an alert when exceeded
- Different thresholds for different severity levels:
  - **Low**: Minor concern
  - **Medium**: Moderate concern
  - **High**: Serious concern
  - **Critical**: Dangerous levels requiring immediate action

**⚠️ Alert (Alerta)**
- A notification generated when measurements exceed thresholds
- Can have different severity levels (low, medium, high, critical)
- Alerts can be marked as "resolved" once the issue is addressed

### System Terms

**🏢 Station (Estación)**
- A physical location where environmental monitoring equipment is installed
- Has GPS coordinates (latitude and longitude)
- Can have multiple sensors measuring different pollutants
- Can be Active, Inactive, or in Maintenance status

**📡 Sensor (Sensor)**
- A device that measures a specific environmental parameter
- Installed at a station
- Examples: PM2.5 sensor, temperature sensor, humidity sensor
- Can be Active or Inactive

**📊 Measurement (Medición)**
- A single data point recorded by a sensor
- Includes: value, timestamp, sensor ID, variable type
- Stored in the database for historical analysis

**🔬 Variable (Variable)**
- The type of environmental parameter being measured
- Examples: PM2.5, PM10, O3, temperature, humidity
- Each variable has a unit (µg/m³, ppb, °C, etc.)

**🏛️ Institution (Institución)**
- An organization that owns and operates monitoring stations
- Can have multiple stations
- Can have multiple users with different roles
- Can be verified by system administrators

**👤 User Role (Rol de Usuario)**
- Defines what a user can do in the system:
  - **Admin General**: Full system access
  - **Admin Institución**: Manages their institution
  - **Operador Estación**: Manages specific stations
  - **Investigador**: Views and analyzes data
  - **Ciudadano**: Basic public access

**🔐 Authentication (Autenticación)**
- The process of logging in to verify your identity
- Requires email and password
- Creates a secure session that lasts until you log out

**🔑 Authorization (Autorización)**
- Determines what you're allowed to do based on your role
- Different roles have different permissions
- Prevents unauthorized access to sensitive features

**📈 Latency (Latencia)**
- The delay between when a measurement is taken and when it appears in the system
- Usually very short (seconds to minutes)
- Can be longer if there are network issues

**💾 Database (Base de Datos)**
- Where all the system's data is stored
- Includes: users, stations, sensors, measurements, alerts
- Managed by system administrators

---

## ❓ Frequently Asked Questions (FAQ)

### 🔍 "Why can't I see my data?"

**Possible Causes and Solutions:**

1. **Station Not Selected**
   - **Solution**: Make sure you've selected a station from the dropdown filter
   - Some pages require a station selection before showing data

2. **Date Range Too Narrow**
   - **Solution**: Try expanding your date range
   - Use "Últimos 7 días" (Last 7 Days) button for a quick filter
   - Check that your end date is after your start date

3. **No Data for Selected Period**
   - **Solution**: Try a different time period
   - Check if the station was active during that time
   - Verify the station status is "Activa" (Active)

4. **Wrong Station Selected**
   - **Solution**: Clear filters and select the correct station
   - Use the search function to find your station by name

5. **Browser Cache Issues**
   - **Solution**: Refresh the page (F5 or Ctrl+R)
   - Clear your browser cache if problems persist
   - Try a different browser

### 🔑 "How do I reset my password?"

**Current Process:**
- Password reset functionality is managed by system administrators
- Contact your system administrator or IT support team
- They can reset your password and provide you with a temporary one

**Future Enhancement:**
- A "Forgot Password" feature may be added in future updates
- This would allow you to reset your password via email

**To Change Your Password (if logged in):**
1. Navigate to **"Configuración"** (Settings) in the sidebar
2. Find the **"Cambiar contraseña"** (Change Password) section
3. Enter your current password
4. Enter your new password
5. Click **"Actualizar contraseña"** (Update Password)

### 📍 "How do I find the GPS coordinates for a new station?"

**Method 1: Using Google Maps (Easiest)**
1. Open [Google Maps](https://www.google.com/maps) in your browser
2. Search for the location or navigate to it on the map
3. **Right-click** on the exact spot where the station is located
4. Click on the coordinates that appear at the top of the menu
5. Copy the latitude and longitude values
   - Example: `3.4516, -76.5320`
   - First number is latitude, second is longitude

**Method 2: Using a GPS Device**
1. Use a GPS device or smartphone GPS app at the station location
2. Record the coordinates shown
3. Make sure the format matches (decimal degrees, not degrees/minutes/seconds)

**Method 3: Using Mobile Apps**
- Apps like "GPS Coordinates" or "My GPS Coordinates" can provide accurate coordinates
- Stand at the exact station location when taking the reading

**Important Notes:**
- Coordinates should be in **decimal format** (e.g., 3.4516, not 3°27'6")
- Latitude ranges from -90 to +90
- Longitude ranges from -180 to +180
- Be as precise as possible for accurate mapping

### 🚨 "I'm getting an error message. What should I do?"

**Common Error Messages and Solutions:**

**"Error al cargar [data]" (Error loading data)**
- **Solution**: 
  1. Check your internet connection
  2. Refresh the page
  3. Try again in a few moments
  4. If it persists, contact technical support

**"No token provided" or "Invalid token"**
- **Solution**: 
  1. You've been logged out - this happens after a period of inactivity
  2. Log in again using your credentials
  3. Make sure you're using the correct email and password

**"Forbidden" or "Access Denied"**
- **Solution**: 
  1. Your user role doesn't have permission for this action
  2. Contact your administrator to request access
  3. Make sure you're logged in with the correct account

**"Usuario no encontrado" (User not found)**
- **Solution**: 
  1. Check that you're using the correct email address
  2. Make sure there are no typos
  3. Contact your administrator if you believe your account should exist

**"Error al guardar" (Error saving)**
- **Solution**: 
  1. Check that all required fields are filled in
  2. Verify that data formats are correct (e.g., numbers for coordinates)
  3. Try again - sometimes it's a temporary network issue
  4. If it persists, check for error details in the message

**General Troubleshooting Steps:**
1. ✅ Refresh the page
2. ✅ Check your internet connection
3. ✅ Try logging out and logging back in
4. ✅ Clear your browser cache
5. ✅ Try a different browser
6. ✅ Contact technical support with:
   - What you were trying to do
   - The exact error message
   - When it occurred

---

## 🎯 Tips for Best Experience

### 💡 General Tips

1. **📱 Mobile-Friendly**: VriSA works on phones and tablets! The interface adapts to your screen size.

2. **🔄 Refresh Regularly**: Data updates automatically, but refreshing ensures you see the latest information.

3. **🔍 Use Filters**: Don't be overwhelmed by data - use filters to focus on what you need.

4. **📊 Sort Tables**: Click column headers to sort data - very helpful for finding specific information.

5. **💾 Save Your Work**: When creating stations or users, make sure to click "Crear" or "Guardar" to save.

6. **⏰ Check Timestamps**: Always check the timestamp on measurements to ensure you're looking at current data.

7. **📧 Keep Credentials Safe**: Never share your login credentials with others.

8. **🚪 Log Out**: Always log out when finished, especially on shared computers.

### 🎨 Understanding Status Colors

- **🟢 Green**: Good/Active - Everything is working normally
- **🟡 Yellow**: Moderate/Pending - Attention may be needed
- **🟠 Orange**: Warning - Action required
- **🔴 Red**: Critical/Inactive - Immediate attention needed

### 📱 Mobile Usage Tips

- **Touch Targets**: All buttons are large enough for easy tapping
- **Swipe**: On mobile, you can swipe tables horizontally to see all columns
- **Menu**: Tap the menu icon (☰) in the top-left to open the navigation menu
- **Filters**: Filters stack vertically on mobile for easier use

---

## 🆘 Getting Help

### Who to Contact

**For Technical Issues:**
- Contact your system administrator
- Provide details about what you were trying to do
- Include any error messages you received

**For Access Requests:**
- Contact your institution administrator
- They can create accounts or change user roles

**For Data Questions:**
- Contact station operators for station-specific questions
- Contact institution administrators for organization-wide questions

### What Information to Provide

When asking for help, include:
1. **What you were trying to do** (e.g., "Create a new station")
2. **What happened** (e.g., "Got an error message")
3. **The exact error message** (copy and paste if possible)
4. **Your user role** (Citizen, Operator, Administrator, etc.)
5. **When it occurred** (date and time)

---

## 📝 Quick Reference

### Keyboard Shortcuts
- **F5 / Ctrl+R**: Refresh the page
- **Ctrl+F**: Search on the current page
- **Tab**: Navigate between form fields
- **Enter**: Submit forms

### Common Actions

**To Log In:**
1. Click "Acceso administrativo"
2. Enter email and password
3. Click "Iniciar sesión"

**To Create a Station:**
1. Go to "Estaciones"
2. Click "+ Nueva Estación"
3. Fill in the form
4. Click "Crear"

**To View Measurements:**
1. Go to "Mediciones"
2. Select a station
3. Apply filters (optional)
4. Review the table

**To Check Alerts:**
1. Go to "Alertas"
2. Use filters to find specific alerts
3. Click edit button to resolve

---

## 🎓 Learning More

### Next Steps

1. **Explore the Dashboard**: Spend time familiarizing yourself with the public dashboard
2. **Try Different Filters**: Experiment with filters to see how they change the data
3. **Review Historical Data**: Look at trends to understand patterns
4. **Read the Glossary**: Understanding terms will help you use the system better

### Training Resources

- **Video Tutorials**: Check with your organization for training videos
- **Workshops**: Attend training sessions if available
- **Practice**: Create test stations or users to practice (if you have permission)

---

## ✅ Conclusion

VriSA is designed to be intuitive and user-friendly. Whether you're a citizen checking air quality or an administrator managing the entire system, this manual should help you navigate and use VriSA effectively.

**Remember:**
- 🎯 Start with the public dashboard to get familiar
- 📖 Refer back to this manual when you need guidance
- 🆘 Don't hesitate to ask for help when needed
- 🔄 The system is always improving - new features may be added

**Happy monitoring! 🌍✨**

---

*Last Updated: 2024*  
*Version: 1.0*  
*For technical support, contact your system administrator.*