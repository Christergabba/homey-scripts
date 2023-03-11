// Set the variable to true to turn the device on or false to turn it off
// const onOff = true; 

// const variables = await Homey.logic.getVariables()

const switch_id = "bb115707-51b0-4907-95cc-492dc22d2955"
//  name: 'allow-switch',

const onOff_id = "043d2b86-e9f5-43e9-8ad1-d0778a076809"
//  name: 'onOff',

const dim_level_id = "f229b453-3588-4375-a627-7bca5839d6a1"

const dim_level = await Homey.logic.getVariable({id: dim_level_id})

var onOff = await Homey.logic.getVariable({id: onOff_id})
log('OnOff value: ', onOff.value);

// Get all devices
const devices = await Homey.devices.getDevices();

// Loop over all devices
for (const device of Object.values(devices)) {
  // If this device is a light (class)
  // Or this is a 'What's plugged in?'-light (virtualClass)
  if (device.class === 'light' || device.virtualClass === 'light') {
    if (device.zone === '9eb2975d-49ea-4033-8db0-105a3e982117' || device.zone === '317258f8-5231-4498-91ee-5ee1e9b2708a'){

      let retryCount = 0;

      while (retryCount < 3) {
        try {
          if (onOff.value === true) {
            log(`\nDimming ${device.name} ${dim_level.value}...`);
            await device.setCapabilityValue('dim', dim_level.value);
          }
          
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
            const message = `Failed to dim  ${device.name} after 3 attempts`;
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
await Homey.logic.updateVariable({id: switch_id, variable: {value: true}})

