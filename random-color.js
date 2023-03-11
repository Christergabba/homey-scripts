const color = true

const switch_id = "bb115707-51b0-4907-95cc-492dc22d2955"

// device.setCapabilityValue('light_mode', 'color');
  // Define an array of 20 common colors in the hue format
  const colors = [
    { hue: 0, name: 'Red' },
    { hue: 0.03, name: 'Pink' },
    { hue: 0.09, name: 'Orange' },
    { hue: 0.16, name: 'Yellow' },
    { hue: 0.25, name: 'Green' },
    { hue: 0.32, name: 'Cool White' },
    { hue: 0.44, name: 'Warm White' },
    { hue: 0.5, name: 'Turquoise' },
    { hue: 0.6, name: 'Lime' },
    { hue: 0.66, name: 'Blue' },
    { hue: 0.8, name: 'Purple' },
    { hue: 0.84, name: 'Pink Purple' },
    { hue: 0.92, name: 'Light Pink' },
    { hue: 0.97, name: 'Pinkish White' },
    { hue: 0.1, name: 'Orange Pink' },
    { hue: 0.13, name: 'Orange Yellow' },
    { hue: 0.18, name: 'Yellow Green' },
    { hue: 0.23, name: 'Green Cyan' },
    { hue: 0.3, name: 'Cyan Blue' },
    { hue: 0.35, name: 'Blue Purple' }
  ];


  const saturation = 1 // Math.random().toFixed(2);
  const brightness = 1 //Math.random().toFixed(2);

if (color === true ){
  const devices = await Homey.devices.getDevices()
 
    _.forEach(devices, device => {
        
        if(device.zoneName.toLowerCase().includes("stua") || device.zoneName.toLowerCase().includes("spisestue")){
          //console.log(device)

          if(device.capabilities.includes("light_hue")){
            // Select a random color from the array
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            console.log(randomColor)

            for (let i = 0; i < 3; i++) {
              try {
                // Actually set color
                device.setCapabilityValue('light_hue', randomColor.hue);
                console.log(`Set hue to ${randomColor.name} (${randomColor.hue}) on ${device.name}`)
                break; // break out of the loop if setting the hue was successful
              } catch (error) {
                console.log(`Failed to set hue to ${randomColor.name} (${randomColor.hue}) on ${device.name}. Retrying (${i + 1}/3)...`)
              }
            }
          }
        }
    }
  );
}
await Homey.logic.updateVariable({id: switch_id, variable: {value: true}})
