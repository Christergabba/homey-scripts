// Constants
const onOff_id = "043d2b86-e9f5-43e9-8ad1-d0778a076809"; // ID for 'onOff'
const dim_level = 0.8; // Dimming level
const switch_id = "bb115707-51b0-4907-95cc-492dc22d2955"; // ID for 'allow-switch'

// Fetch the onOff variable
var onOff = await Homey.logic.getVariable({ id: onOff_id });
log('OnOff value: ', onOff.value);

// Get all devices
const devices = await Homey.devices.getDevices();

let failedDevices = []; // List to track failed devices

// Initial pass: Try to control all lights once
for (const device of Object.values(devices)) {
  if (device.class === 'light' || device.virtualClass === 'light') {
    if (device.zoneName.toLowerCase().includes("stua") || device.zoneName.toLowerCase().includes("spisestue")) {
      log(`\nAttempting to turn '${device.name}' ${onOff.value ? 'on' : 'off'}...`);
      try {
        await device.setCapabilityValue('onoff', onOff.value);
        if (onOff.value === true) {
            await device.setCapabilityValue('dim', dim_level);
        }
        log('Success');
      } catch (error) {
        log(`Error on first attempt for ${device.name}:`, error);
        failedDevices.push(device); // Add to list of failed devices
      }
    }
  }
}

// Retry for failed devices
for (const device of failedDevices) {
  let retryCount = 0;
  while (retryCount < 3) {
    log(`\nRetrying to turn '${device.name}' ${onOff.value ? 'on' : 'off'}...`);
    try {
      await device.setCapabilityValue('onoff', onOff.value);
      if (onOff.value === true) {
          await device.setCapabilityValue('dim', dim_level);
      }
      log('Retry successful');
      break;
    } catch (error) {
      retryCount++;
      log(`Retry error:`, error);
      if (retryCount >= 3) {
        const message = `Failed to turn ${onOff.value ? 'on' : 'off'} ${device.name} after 3 attempts`;
        await Homey.flow.runFlowCardAction({
          uri: 'homey:manager:notifications',
          id: 'create_notification',
          args: {
            text: message
          }
        });
      } else {
        log(`Retrying in 1 second...`);
        await wait(1000);
      }
    }
  }
}

// Update the 'allow-switch' variable
await Homey.logic.updateVariable({ id: switch_id, variable: { value: true } });
