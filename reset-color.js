const color = false

const switch_id = "bb115707-51b0-4907-95cc-492dc22d2955"

if (color === false) {
  // Get all devices
  const devices = await Homey.devices.getDevices()

  // Loop over all devices
  for (const device of Object.values(devices)) {
    // Only do stuff to devices in stua or spisestue
      if (device.zoneName.toLowerCase().includes("stua") || device.zoneName.toLowerCase().includes("spisestue")) {
        if (device.capabilities.includes("light_hue")) {
          // Select a random color from the array
          let retryCount = 0;

          while (retryCount < 3) {
            log(`\nSetting '${device.name}' to temperature mode...`)
            try {
              await device.setCapabilityValue('light_mode', 'temperature')
              log('OK');
              break; // exit the retry loop if the operation succeeds
            } catch (error) {
              retryCount++;
              log(`Error:`, error);
              if (retryCount < 3) {
                log(`Retrying in 1 second...`);
                await wait(1000);
              } else {
                // Log error to Timeline if maximum retries has been reached
                const message = `Failed to set light_mode to ${device.name} after 3 attempts`;
                await Homey.flow.runFlowCardAction({
                  uri: 'homey:manager:notifications',
                  id: 'create_notification',
                  args: {
                  text: message },
                });
              }
            }
          }
      }
    }
  }
}
console.log("Success, resetting allow-switch")
await Homey.logic.updateVariable({id: switch_id, variable: {value: true}});
