const color = false

const switch_id = "bb115707-51b0-4907-95cc-492dc22d2955"

if (color === false ){
  const devices = await Homey.devices.getDevices()
 
    _.forEach(devices, device => {        
        if(device.zoneName.toLowerCase().includes("stua") || device.zoneName.toLowerCase().includes("spisestue")){
          if(device.capabilities.includes("light_hue")){
            //console.log(device)
            for (let i = 0; i < 3; i++) {
              try {
                // Actually set color
                device.setCapabilityValue('light_mode', 'temperature');
                console.log(`Set light_mode to temperature on ${device.name}`)
                break; // break out of the loop if setting the hue was successful
              } catch (error) {
                console.log(`Failed to set light_mode on ${device.name}. Retrying (${i + 1}/3)...`)
              }
            }
          }
        }
    }
  )
}
await Homey.logic.updateVariable({id: switch_id, variable: {value: true}})
